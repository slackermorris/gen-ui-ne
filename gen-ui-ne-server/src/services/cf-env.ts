import { Context } from 'effect';

export class WorkerEnvironment extends Context.Service<WorkerEnvironment, { readonly env: Env }>()(
  'WorkerEnvironment',
) {}
export class WorkerContext extends Context.Service<
  WorkerContext,
  { readonly ctx: ExecutionContext }
>()('WorkerContext') {}
