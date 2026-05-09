import { Context } from "effect";

export class CfEnv extends Context.Service<
    CfEnv,
    { readonly env: Env; readonly ctx: ExecutionContext }
>()("CfEnv") {
}