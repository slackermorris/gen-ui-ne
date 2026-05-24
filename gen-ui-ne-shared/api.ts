import { Schema } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/unstable/httpapi";
import { Spec } from './domain'

class BaseGroup extends HttpApiGroup.make("base")
  .add(
    HttpApiEndpoint.get("getUI", "/:name", {
      params: { name: Schema.String },
      success: Spec,
    }),
  )
  .prefix("/gen-ui-ne") {}

export class Api extends HttpApi.make("Api").add(BaseGroup) {}