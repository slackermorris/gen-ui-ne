import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { Effect, Layer, Schema } from 'effect';
import { DurableObjectNamespace } from './services/durable-object-namespace';
import { Api } from 'gen-ui-ne-shared/api';
import { Spec } from 'gen-ui-ne-shared/model';
import { OtlpLogRecordToLogInsertDto } from './models/dto';

const BaseLive = HttpApiBuilder.group(Api, 'base', (handlers) =>
	handlers
		.handle('getUI', ({ params }) =>
			Effect.gen(function* () {
				const doNamespace = yield* DurableObjectNamespace;
				const stub = yield* doNamespace.getByName(params.name);
				const raw = yield* Effect.promise(() => stub.getUi(params.name));

				// TODO: simulate a decoding error
				return Schema.decodeUnknownSync(Spec)(raw);
			}),
		)
		.handle('log', ({ params, payload }) =>
			Effect.gen(function* () {
				// TODO: add some logging
				const doNamespace = yield* DurableObjectNamespace;
				const stub = yield* doNamespace.getByName(params.name);
				const logs = Schema.decodeSync(Schema.Array(OtlpLogRecordToLogInsertDto))(payload.logs);


				yield* Effect.promise(() => stub.ingestLogs(logs));

				return {
					ok: true,
				};
			}),
		),
);

export const ApiLive = HttpApiBuilder.layer(Api).pipe(Layer.provide(BaseLive));
