import { Context, Effect, Layer } from 'effect';
import { WorkerEnvironment } from './cf-env';
import { BindingNotFoundError, BindingValidationError } from '../tagged-errors';
import type { MyDurableObject } from '..';

type Stub = DurableObjectStub<MyDurableObject>;
export class DurableObjectNamespace extends Context.Service<
	DurableObjectNamespace,
	{
		get: (id: DurableObjectId) => Effect.Effect<Stub>;
		getByName: (name: string) => Effect.Effect<Stub>;
		newUniqueId: () => Effect.Effect<DurableObjectId>;
		idFromName: (name: string) => Effect.Effect<DurableObjectId>;
		idFromString: (id: string) => Effect.Effect<DurableObjectId>;
	}
>()('DurableObjectNamespace') {
	static readonly Live = Layer.effect(
		DurableObjectNamespace,
		Effect.gen(function* () {
			const { env } = yield* WorkerEnvironment;

			const dOnamespace = env.MY_DURABLE_OBJECT;

			if (dOnamespace == null) {
				return yield* Effect.fail(new BindingNotFoundError({ binding: 'MY_DURABLE_OBJECT' }));
			} else if (typeof dOnamespace !== 'object') {
				return yield* Effect.fail(new BindingValidationError({ binding: 'MY_DURABLE_OBJECT' }));
			}


			return {
				get: (id: DurableObjectId) => Effect.sync(() => dOnamespace.get(id)),
				getByName: (name: string) => Effect.sync(() => dOnamespace.getByName(name)),
				newUniqueId: () => Effect.sync(() => dOnamespace.newUniqueId()),
				idFromName: (name: string) => Effect.sync(() => dOnamespace.idFromName(name)),
				idFromString: (id: string) => Effect.sync(() => dOnamespace.idFromString(id)),
			};
		}),
	);
}
