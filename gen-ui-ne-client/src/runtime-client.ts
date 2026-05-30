import { ConfigProvider, Layer, ManagedRuntime } from "effect";
import { Registry } from "./renderer/registry";
import { ApiClient } from "./services/api";

const MainLayer = Layer.mergeAll(Registry.Live, ApiClient.Live).pipe(
  Layer.provide(
    ConfigProvider.layer(ConfigProvider.fromUnknown(import.meta.env)),
  ),
);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
