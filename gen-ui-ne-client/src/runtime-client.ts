import { ConfigProvider, Layer, ManagedRuntime } from 'effect';
import { layer as RegistryLayer } from './renderer/registry';
import * as Api from './services/api';

import { FetchHttpClient } from 'effect/unstable/http';

const ApiLayer = Api.defaultLayer.pipe(Layer.provide(FetchHttpClient.layer));

const MainLayer = Layer.mergeAll(RegistryLayer, ApiLayer).pipe(
  Layer.provide(ConfigProvider.layer(ConfigProvider.fromUnknown(import.meta.env))),
);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
