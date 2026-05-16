import { DurableObject } from 'cloudflare:workers';
import { Context, Effect, Layer } from 'effect';
import { HttpRouter, HttpServer } from 'effect/unstable/http';
import { CfEnv } from './services/cf-env';
import { ApiLive } from './http';

export class MyDurableObject extends DurableObject<Env> {
	async sayHello(name: string) {
		return `Hello, ${name}!`;
	}
}

const CorsMiddleware = HttpRouter.cors({
	allowedOrigins: ['http://localhost:5173'],
});

const { handler } = HttpRouter.toWebHandler(ApiLive.pipe(Layer.provide([HttpServer.layerServices, CorsMiddleware])));

export default {
	async fetch(request, env, ctx) {
		return handler(request, Context.make(CfEnv, { env, ctx }));
	},
} satisfies ExportedHandler<Env>;
