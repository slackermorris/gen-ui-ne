import { HttpApiBuilder } from 'effect/unstable/httpapi';
import { Api } from './api';
import { Effect, Layer, Schema } from 'effect';
import { HttpRouter, HttpServer, HttpServerResponse } from 'effect/unstable/http';
import { CfEnv } from './services/cf-env';


const BaseLive = HttpApiBuilder.group(Api, 'base', (handlers) => handlers.handle('getUI', () => handleGetUi)).pipe(Layer.provide(HttpServer.layerServices));

const handleGetUi = Effect.gen(function* () {
	const { name } = yield* HttpRouter.params;
	const { env } = yield* CfEnv;

	if (name) {
		const stub = env.MY_DURABLE_OBJECT.getByName(name);
		const greeting = yield* Effect.promise(() => stub.sayHello('world'));
        return { ui: ''}
	}

    return HttpServerResponse.empty()
});

export const ApiLive = HttpApiBuilder.layer(Api).pipe(Layer.provide(BaseLive));
