import { Schema } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/unstable/httpapi";
import { Spec } from "./domain";
import { OtlpLogRecord } from "./api-schema";

class BaseGroup extends HttpApiGroup.make("base")
  .add(
    HttpApiEndpoint.get("getUI", "/:name", {
      params: { name: Schema.String },
      success: Spec,
    }),
    HttpApiEndpoint.post("log", "/:name/log", {
      params: { name: Schema.String },
      payload: Schema.Struct({
        logs: Schema.Array(OtlpLogRecord),
      }),
      success: Schema.Struct({
        ok: Schema.Boolean,
      }),
    }),
  )
  .prefix("/gen-ui-ne") {}

export class Api extends HttpApi.make("Api").add(BaseGroup) {}
