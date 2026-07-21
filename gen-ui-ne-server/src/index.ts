import { DurableObject, WorkerEntrypoint } from 'cloudflare:workers';
import { Context, Layer } from 'effect';
import { HttpRouter, HttpServer } from 'effect/unstable/http';
import { WorkerEnvironment, WorkerContext } from './services/cf-env';
import { ApiLive } from './http';
import * as DurableObjectNamespace from './services/durable-object-namespace';
import { generateText, tool, hasToolCall, jsonSchema } from 'ai';
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
    const anthropic = createAnthropic({ apiKey: this.env.ANTHROPIC_API_KEY });
    const selector = this.env.SPEC_SELECTOR as unknown as SpecSelector;

    const result = await generateText({
      model: anthropic('claude-sonnet-4-6'),
      system: SYSTEM_PROMPT,
      prompt: `Render the dashboard for user "${name} ?? 'unknown user'".`,
      tools: {
        selectSpec: tool({
          description: 'Generate a personalised UI spec for an investor based on their context',
          inputSchema: jsonSchema({ type: 'object', properties: {}, additionalProperties: false }),
          execute: async () => selector.generate(name),
        }),
      },
      stopWhen: hasToolCall('selectSpec'),
    });

    for (const step of result.steps) {
      for (const toolResult of step.toolResults ?? []) {
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
          throw new Error(
            `selectSpec failed: ${part.error instanceof Error ? part.error.message : String(part.error)}`,
          );
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

  // TEMPORARY: seeding only — remove before prod.
  // Wipes this user's logs and inserts a fresh narrative batch. Idempotent.
  async seed(rows: ReadonlyArray<LogInsertDto>) {
    this.ctx.storage.transactionSync(() => {
      this.ctx.storage.sql.exec('DELETE FROM logs');
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
    });
    return { inserted: rows.length };
  }

  async getRecentLogs(limit: number = 100) {
    type LogRow = {
      ts: number;
      severity: number;
      body: string;
      attributes: string;
    };
    const cursor = this.ctx.storage.sql.exec<LogRow>(
      'SELECT ts, severity, body, attributes FROM logs ORDER BY ts DESC LIMIT ?',
      limit,
    );
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

    const DurableObjectLayer = DurableObjectNamespace.layer.pipe(
      Layer.provide(Layer.succeed(WorkerEnvironment, { env })),
    );

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
