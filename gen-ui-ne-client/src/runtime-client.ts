import { ConfigProvider, Layer, ManagedRuntime } from "effect";
import { Registry } from "./renderer/registry";
import { Api, BuildApiUrl } from "./services/api";
import { FetchHttpClient } from "effect/unstable/http";

const ApiLayer = Api.Live.pipe(Layer.provide(BuildApiUrl.Live), Layer.provide(FetchHttpClient.layer));

const MainLayer = Layer.mergeAll(Registry.Live, ApiLayer).pipe(
  Layer.provide(
    ConfigProvider.layer(ConfigProvider.fromUnknown(import.meta.env)),
  ),
);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
