import { AppStateProvider } from "./state/app-state";
import { DesignSystem } from "./playground/DesignSystem";

import { useEffect, useState } from "react";
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
    const recoverable = program.pipe(
      Effect.catchTag("NetworkError", (error) => Effect.fail(error)),
    );
    RuntimeClient.runPromise(recoverable).catch(showErrorBoundary);
  }, [userName]);

  return (
    <AppStateProvider>{uiSpec && <Renderer spec={uiSpec} />}</AppStateProvider>
  );
}

// function App() {
//   return (
//     <AppStateProvider>
//       <DesignSystem />
//     </AppStateProvider>
//   );
// }

export default App;
