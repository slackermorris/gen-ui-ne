import { DurableObject } from "cloudflare:workers";
import { Context, Effect, Layer } from "effect";
import {
	HttpMiddleware,
	HttpRouter,
	HttpServer,
	HttpServerResponse,
} from "effect/unstable/http";
import { CfEnv } from "./services/cf-env";

export class MyDurableObject extends DurableObject<Env> {
	async sayHello(name: string) {
		return `Hello, ${name}!`;
	}
}

const CorsMiddleware = HttpRouter.cors({
	allowedOrigins: ['http://localhost:5173']
})

const Routes = HttpRouter.addAll([
	HttpRouter.route(
		"GET",
		"/:name",
		Effect.gen(function* () {
			const { name } = yield* HttpRouter.params;
			const { env } = yield* CfEnv;

			if (name) {
				const stub = env.MY_DURABLE_OBJECT.getByName(name);
				const greeting = yield* Effect.promise(() => stub.sayHello("world"));
				return HttpServerResponse.text(greeting)
			}

			return HttpServerResponse.empty()

		}),
	),
]).pipe(Layer.provide(
	[CorsMiddleware]
));

const { handler } = HttpRouter.toWebHandler(
	Routes.pipe(Layer.provide(HttpServer.layerServices)),
);

export default {
	async fetch(request, env, ctx) {
		return handler(request, Context.make(CfEnv, { env, ctx }));
	},
} satisfies ExportedHandler<Env>;
