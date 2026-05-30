import { Effect } from "effect";
import { ApiClient } from "../../services/api";
import { RuntimeClient } from "../../runtime-client";
import { useShowErrorBoundary } from "../../hooks/useShowErrorBoundary";

import type { OtlpLogRecord } from "gen-ui-ne-shared/api-schema";

interface PromptCardProps {
  title: string;
  message: string;
  action?: string;
}

export function PromptCard({ title, message, action }: PromptCardProps) {
  const showErrorBoundary = useShowErrorBoundary();

  function handleClick() {
    const userName = window.location.pathname.slice(1);

    console.log("Capturing an event off the prompt card");

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
      const client = yield* ApiClient;
      const response = yield* client.base.log({ params: { name: userName }, payload: { logs: [payload] } });

      console.log("logging the response", { response });
    });

    const recoverable = program;

    RuntimeClient.runPromise(recoverable).catch(showErrorBoundary);
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm">
      <p className="font-semibold text-green-900">{title}</p>
      <p className="mt-1 text-sm text-green-800">{message}</p>
      {action && (
        <button
          className="mt-3 rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          onClick={handleClick}
        >
          {action}
        </button>
      )}
    </div>
  );
}
