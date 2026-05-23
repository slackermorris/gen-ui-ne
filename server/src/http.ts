import { HttpApiBuilder } from 'effect/unstable/httpapi';
import { Api } from './api';
import { Effect, Layer } from 'effect';
import { HttpRouter, HttpServer } from 'effect/unstable/http';
import { DurableObjectNamespace } from './services/durable-object-namespace';


const BaseLive = HttpApiBuilder.group(Api, 'base', (handlers) => handlers.handle('getUI', () => handleGetUi));

const handleGetUi = Effect.gen(function* () {
	const { name } = yield* HttpRouter.params;

	const doNamespace = yield* DurableObjectNamespace;
	const stub = yield* doNamespace.getByName(name!);

	const greeting = yield* Effect.promise(() => stub.sayHello('world'));
	return { ui: greeting };
});

export const ApiLive = HttpApiBuilder.layer(Api).pipe(Layer.provide(BaseLive));
