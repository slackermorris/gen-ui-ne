import { useEffect, useState } from "react";
import { AppStateProvider } from "./state/app-state";
import { Renderer } from "./renderer/renderer";
import { RuntimeClient } from "./runtime-client";
import { Effect } from "effect";
import { ApiClient } from "./services/api";
import { useShowErrorBoundary } from "./hooks/useShowErrorBoundary";
import type { Spec } from "gen-ui-ne-shared/model";

function App() {
  const showErrorBoundary = useShowErrorBoundary();

  const [uiSpec, setUiSpec] = useState<Spec | null>(null);

  const userName = window.location.pathname.slice(1);

  useEffect(() => {
    const program = Effect.gen(function* () {
      const client = yield* ApiClient;
      const uiSpec = yield* client.base.getUI({ params: { name: userName } });

      setUiSpec(uiSpec);
    });

    RuntimeClient.runPromise(program).catch(showErrorBoundary);
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
