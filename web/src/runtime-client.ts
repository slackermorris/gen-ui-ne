import { Layer, ManagedRuntime } from "effect";
import { Registry } from "./renderer/registry";

const MainLayer = Layer.mergeAll(Registry.Live)

export const RuntimeClient = ManagedRuntime.make(MainLayer)