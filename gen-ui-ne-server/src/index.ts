import { DurableObject, WorkerEntrypoint } from 'cloudflare:workers';
import { Context, Layer } from 'effect';
import { HttpRouter, HttpServer } from 'effect/unstable/http';
import { WorkerEnvironment, WorkerContext } from './services/cf-env';
import { ApiLive } from './http';
import { DurableObjectNamespace } from './services/durable-object-namespace';

import { PERSONALISED_UI_SCHEMA } from './dummy-data';

import type { Spec } from 'gen-ui-ne-shared/model';
import type { LogInsertDto } from './models/dto';

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
		// @ts-ignore: I know the string can be counted to be what I hardcoded them as.
		const uiSpec: Spec = PERSONALISED_UI_SCHEMA[name].spec;
		return uiSpec;
	}

	async ingestLogs(rows: ReadonlyArray<LogInsertDto>) {
		// TODO: wrap this in a transaction
		for (const row of rows) {
			console.log('logging each row', { row });
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
