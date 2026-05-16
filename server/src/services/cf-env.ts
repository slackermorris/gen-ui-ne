import { Context } from 'effect';

export const CfEnv = Context.Service<{ readonly env: Env; readonly ctx: ExecutionContext }>("CfEnv")
