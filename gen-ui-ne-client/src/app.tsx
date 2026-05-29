import { useEffect, useState } from "react";
import { AppStateProvider } from "./state/app-state";
import { Renderer } from "./renderer/renderer";
import { RuntimeClient } from "./runtime-client";
import { Effect } from "effect";
import { Api } from "./services/api";
import { useShowErrorBoundary } from "./hooks/useShowErrorBoundary";
import type { Spec } from "gen-ui-ne-shared/model";

function App() {
  const showErrorBoundary = useShowErrorBoundary();

  const [uiSpec, setUiSpec] = useState<Spec | null>(null);

  const userName = window.location.pathname.slice(1);

  useEffect(() => {
    const program = Effect.gen(function* () {
      const api = yield* Api;
      const uiSpec = yield* api.getGenerativeUi(userName);

      setUiSpec(uiSpec);
    });

    // TODO: figure out is handling errors here is the best place
    const recoverable = program.pipe(
      Effect.catchTag("NetworkError", (error) => Effect.fail(error)),
    );

    RuntimeClient.runPromise(recoverable).catch(showErrorBoundary);
  }, [userName]);


  return (
    <AppStateProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-sm p-8">
          {uiSpec && <Renderer spec={uiSpec} />}
        </div>
      </div>
    </AppStateProvider>
  );
}

export default App;
