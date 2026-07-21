import { Effect, Schema } from "effect";
import { Api } from "../../services/api";
import { RuntimeClient } from "../../runtime-client";
import { useShowErrorBoundary } from "../../hooks/useShowErrorBoundary";

import type { OtlpLogRecord } from "gen-ui-ne-shared/api-schema";

// @schema-export-start
export const PromptCardProps = Schema.Struct({
  title: Schema.String,
  message: Schema.String,
  action: Schema.optionalKey(Schema.String),
}).annotate({
  description:
    "A call-to-action card with a title, message, and optional action label. Use to surface a recommendation, prompt, or insight the investor should act on.",
});
// @schema-export-end

type PromptCardProps = typeof PromptCardProps.Type;

export function PromptCard({ title, message, action }: PromptCardProps) {
  const showErrorBoundary = useShowErrorBoundary();

  function handleClick() {
    const userName = window.location.pathname.slice(1);

    const payload: OtlpLogRecord = {
      timeUnixNano: "1748563200000000000",
      severityNumber: 9,
      severityText: "INFO",
      body: `User clicked ${action}`,
      attributes: [
        {
          key: "user.action",
          value: "browse_investments",
        },
        {
          key: "component",
          value: "PromptCard",
        },
      ],
      traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
      spanId: "00f067aa0ba902b7",
    };

    const program = Effect.gen(function* () {
      const api = yield* Api;
      yield* api.sendLog(userName, { logs: [payload] });
    });

    const recoverable = program;

    RuntimeClient.runPromise(recoverable).catch(showErrorBoundary);
  }

  return (
    <div className="rounded-lg border border-success/20 bg-success/10 p-5 shadow-xs">
      <p className="font-semibold text-success">{title}</p>
      <p className="mt-1 text-sm text-foreground/80">{message}</p>
      {action && (
        <button
          className="mt-3 rounded-md bg-success px-4 py-1.5 text-sm font-medium text-success-foreground hover:bg-success/90"
          onClick={handleClick}
        >
          {action}
        </button>
      )}
    </div>
  );
}
