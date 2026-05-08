import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject<Env> {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param ctx - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	
	async sayHello(name: string) {
		return `Hello, ${name}!`;
	}
}

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx) {
		// Isolate a single remote DO instance. Requests from workers will go there.
		const stub = env.MY_DURABLE_OBJECT.getByName(new URL(request.url).pathname);

		// Call an RPC method on the stub.
		const greeting = await stub.sayHello("world");

		return new Response(greeting);
	},
} satisfies ExportedHandler<Env>;
