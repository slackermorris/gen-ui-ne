import { DurableObject, WorkerEntrypoint } from 'cloudflare:workers';
import { Context, Layer } from 'effect';
import { HttpRouter, HttpServer } from 'effect/unstable/http';
import { WorkerEnvironment, WorkerContext } from './services/cf-env';
import { ApiLive } from './http';
import { DurableObjectNamespace } from './services/durable-object-namespace';
import { generateText, tool, jsonSchema, hasToolCall } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

import type { SpecSelector } from './spec-selector';
import type { LogInsertDto } from './models/dto';

const SYSTEM_PROMPT = `You are the orchestrator for a personalised investment dashboard called Sharesies.
You receive requests and use tools to fulfill them. When asked to render a user's dashboard, call selectSpec with a clear description of their investment context.`;

export class Orchestrator extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		const createLogTableStatement = `CREATE TABLE IF NOT EXISTS logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			ts INTEGER NOT NULL, 
			severity INTEGER NOT NULL,
			body TEXT NOT NULL,
			trace_id TEXT,
			span_id TEXT,
			attributes NOT NULL
		)
		`;

		this.ctx.storage.sql.exec(createLogTableStatement);
	}

	async getUi(name: string) {
		const userData: Record<string, string> = {
			jack: 'New investor, no holdings yet, risk profile 3/7 (moderate-low).',
			rose: 'Active investor, $18,420 portfolio, holdings: Apple (AAPL $4,200 +32.1%), Meridian Energy (MEL $2,800 +8.4%), Fisher & Paykel (FPH $1,950 -2.1%), allocation: US 52% NZ 31% AU 17%, total return +21.3%.',
			robert:
				'Passive investor, $9,840 portfolio, auto-invests $50 weekly next 19 May 2026, allocation: NZ ETF 60% US ETF 30% AU ETF 10%, return +9.3%.',
			kennedy: 'Concerned investor, $14,200 portfolio down $1,800 (-11.3%), heavily concentrated in US Tech (71%), risk level 6/7 (high).',
		};

		const anthropic = createAnthropic({ apiKey: this.env.ANTHROPIC_API_KEY });
		const selector = this.env.SPEC_SELECTOR as unknown as SpecSelector;

		const result = await generateText({
			model: anthropic('claude-sonnet-4-6'),
			system: SYSTEM_PROMPT,
			prompt: `Render the dashboard for user "${name}". Data: ${userData[name] ?? 'unknown user'}`,
			tools: {
				selectSpec: tool({
					description: 'Generate a personalised UI spec for an investor based on their context',
					inputSchema: jsonSchema<{ userContext: string }>({
						type: 'object',
						properties: {
							userContext: {
								type: 'string',
								description: 'A description of the investor including their portfolio, holdings, risk profile, and relevant context',
							},
						},
						required: ['userContext'],
					}),
					execute: async ({ userContext }) => selector.generate(name, userContext),
				}),
			},
			stopWhen: hasToolCall('selectSpec'),
		});

		for (const step of result.steps) {
			for (const toolResult of step.toolResults ?? []) {
				console.log('logging the tool result', { toolResult });
				if (toolResult.toolName === 'selectSpec') {
					return toolResult.output;
				}
			}
			// Surface the real failure: when execute() throws, the SDK records a
			// tool-error part instead of a tool-result, which would otherwise be
			// hidden behind a misleading "did not invoke selectSpec".
			for (const part of step.content ?? []) {
				if (part.type === 'tool-error' && part.toolName === 'selectSpec') {
					console.error('selectSpec execution failed', part.error);
					throw new Error(`selectSpec failed: ${part.error instanceof Error ? part.error.message : String(part.error)}`);
				}
			}
		}

		throw new Error('Orchestrator did not invoke selectSpec');
	}

	async ingestLogs(rows: ReadonlyArray<LogInsertDto>) {
		// TODO: wrap this in a transaction
		for (const row of rows) {
			this.ctx.storage.sql.exec(
				`INSERT INTO logs (ts, severity, body, trace_id, span_id, attributes) VALUES (?, ?, ?, ?, ?, ?)`,
				row.ts,
				row.severity,
				row.body,
				row.trace_id,
				row.span_id,
				row.attributes,
			);
		}
	}

	async getRecentLogs(limit: number = 100) {
		type LogRow = {
			ts: number;
			severity: number;
			body: string;
			attributes: string;
		};
		const cursor = this.ctx.storage.sql.exec<LogRow>('SELECT ts, severity, body, attributes FROM logs ORDER BY ts DESC LIMIT ?', limit);
		return [...cursor];
	}
}

const CorsMiddleware = HttpRouter.cors({
	allowedOrigins: ['http://localhost:5173'],
});

export default class extends WorkerEntrypoint<Env> {
	// TODO: fix up the typing here
	private readonly handler: (...args: any[]) => Promise<Response>;

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);

		const DurableObjectLayer = DurableObjectNamespace.Live.pipe(Layer.provide(Layer.succeed(WorkerEnvironment, { env })));

		const MainLayer = ApiLive.pipe(
			Layer.provide(HttpServer.layerServices),
			Layer.provide(CorsMiddleware),
			Layer.provide(DurableObjectLayer),
		);

		const { handler } = HttpRouter.toWebHandler(MainLayer);
		this.handler = handler;
	}

	fetch(request: Request): Promise<Response> {
		return this.handler(request, Context.make(WorkerContext, { ctx: this.ctx }));
	}
}
