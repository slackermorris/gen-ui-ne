import { useEffect, useState } from "react";
import { AppStateProvider } from "./state/app-state";
import { Renderer } from "./renderer/renderer";
import type { Spec } from "./renderer/types";
import { cn } from "./utils/cn";
import { RuntimeClient } from "./runtime-client";
import { Effect } from "effect";
import { Api } from "./services/api";

const personas = {
  new: {
    label: "New investor",
    spec: {
      root: "page",
      elements: {
        page: {
          type: "Stack",
          props: { direction: "vertical", gap: "md" },
          children: ["value", "prompt", "risk"],
        },
        value: {
          type: "PortfolioValue",
          props: {
            value: "$0.00",
            change: "$0.00",
            changePercent: "0%",
            direction: "neutral",
          },
        },
        prompt: {
          type: "PromptCard",
          props: {
            title: "Start your investment journey",
            message:
              "You haven't made any investments yet. Browse NZ, AU and US shares to get started.",
            action: "Browse investments",
          },
        },
        risk: {
          type: "RiskIndicator",
          props: { rating: 3, label: "Your risk profile" },
        },
      },
    } satisfies Spec,
  },

  active: {
    label: "Active investor",
    spec: {
      root: "page",
      elements: {
        page: {
          type: "Stack",
          props: { direction: "vertical", gap: "md" },
          children: ["value", "returnBadge", "holdings", "allocation"],
        },
        value: {
          type: "PortfolioValue",
          props: {
            value: "$18,420",
            change: "+$3,240",
            changePercent: "+21.3%",
            direction: "positive",
          },
        },
        returnBadge: {
          type: "ReturnBadge",
          props: {
            value: "+21.3%",
            direction: "positive",
            label: "Total return",
          },
        },
        holdings: {
          type: "Stack",
          props: { direction: "vertical", gap: "sm" },
          children: ["holding1", "holding2", "holding3"],
        },
        holding1: {
          type: "HoldingRow",
          props: {
            name: "Apple Inc.",
            code: "AAPL",
            value: "$4,200",
            returnPercent: "+32.1%",
            direction: "positive",
          },
        },
        holding2: {
          type: "HoldingRow",
          props: {
            name: "Meridian Energy",
            code: "MEL",
            value: "$2,800",
            returnPercent: "+8.4%",
            direction: "positive",
          },
        },
        holding3: {
          type: "HoldingRow",
          props: {
            name: "Fisher & Paykel",
            code: "FPH",
            value: "$1,950",
            returnPercent: "-2.1%",
            direction: "negative",
          },
        },
        allocation: {
          type: "AllocationBar",
          props: {
            segments: [
              { label: "US", percent: 52 },
              { label: "NZ", percent: 31 },
              { label: "AU", percent: 17 },
            ],
          },
        },
      },
    } satisfies Spec,
  },

  passive: {
    label: "Passive investor",
    spec: {
      root: "page",
      elements: {
        page: {
          type: "Stack",
          props: { direction: "vertical", gap: "md" },
          children: ["value", "autoInvest", "allocation"],
        },
        value: {
          type: "PortfolioValue",
          props: {
            value: "$9,840",
            change: "+$840",
            changePercent: "+9.3%",
            direction: "positive",
          },
        },
        autoInvest: {
          type: "AutoInvestCard",
          props: {
            amount: "$50",
            frequency: "Weekly",
            nextDate: "19 May 2026",
          },
        },
        allocation: {
          type: "AllocationBar",
          props: {
            segments: [
              { label: "NZ ETF", percent: 60 },
              { label: "US ETF", percent: 30 },
              { label: "AU ETF", percent: 10 },
            ],
          },
        },
      },
    } satisfies Spec,
  },

  concerned: {
    label: "Concerned investor",
    spec: {
      root: "page",
      elements: {
        page: {
          type: "Stack",
          props: { direction: "vertical", gap: "md" },
          children: ["value", "risk", "allocation", "returnBadge"],
        },
        value: {
          type: "PortfolioValue",
          props: {
            value: "$14,200",
            change: "-$1,800",
            changePercent: "-11.3%",
            direction: "negative",
          },
        },
        risk: {
          type: "RiskIndicator",
          props: { rating: 6, label: "Portfolio risk level" },
        },
        allocation: {
          type: "AllocationBar",
          props: {
            segments: [
              { label: "US Tech", percent: 71 },
              { label: "NZ", percent: 19 },
              { label: "AU", percent: 10 },
            ],
          },
        },
        returnBadge: {
          type: "ReturnBadge",
          props: {
            value: "-11.3%",
            direction: "negative",
            label: "Total return",
          },
        },
      },
    } satisfies Spec,
  },
} as const;

type PersonaKey = keyof typeof personas;

function App() {
  const [persona, setPersona] = useState<PersonaKey>("new");

  useEffect(() => {
    console.log('logging here')
    const program = Effect.gen(function* () {
      const api = yield* Api;
      const response = yield* api.getGenerativeUi();
      console.log('logging the response', response);
    });

    RuntimeClient.runPromise(program);
  }, []);

  return (
    <AppStateProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="border-b border-gray-200 bg-white px-8 py-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
            Persona
          </p>
          <div className="flex gap-2">
            {(Object.keys(personas) as PersonaKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setPersona(key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  persona === key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                {personas[key].label}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-sm p-8">
          <Renderer spec={personas[persona].spec} />
        </div>
      </div>
    </AppStateProvider>
  );
}

export default App;
