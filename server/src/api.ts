  import { Schema } from "effect";
  import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";

  class BaseGroup extends HttpApiGroup.make("base")
    .add(
      HttpApiEndpoint.get("getUI", "/:name", {
        // TODO: define endpoint as returning JSON
        success: Schema.Struct({ uiSpec: Schema.String }),
      }),
    )
    .prefix("/gen-ui-ne") {}

  export class Api extends HttpApi.make("Api").add(BaseGroup) {}
