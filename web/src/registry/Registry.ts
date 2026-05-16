import { Context } from "effect";

export class Registry extends Context.Service<Registry, {
    readonly hello: string
}>()("Registry"){} 