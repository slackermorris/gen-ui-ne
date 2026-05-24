import type { ComponentType } from "react";
import { Stack } from "../components/layout/Stack";
import { Grid } from "../components/layout/Grid";
import { PortfolioValue } from "../components/investment/PortfolioValue";
import { ReturnBadge } from "../components/investment/ReturnBadge";
import { AllocationBar } from "../components/investment/AllocationBar";
import { RiskIndicator } from "../components/investment/RiskIndicator";
import { AutoInvestCard } from "../components/investment/AutoInvestCard";
import { PromptCard } from "../components/investment/PromptCard";
import { HoldingRow } from "../components/investment/HoldingRow";
import { Context, Layer, Option } from "effect";
import { valueOf } from "../utils/type-helper";
import type { ElementType } from "gen-ui-ne-shared/model";

const registry: Record<ElementType, ComponentType<any>> = {
  Stack,
  Grid,
  PortfolioValue,
  ReturnBadge,
  AllocationBar,
  RiskIndicator,
  AutoInvestCard,
  HoldingRow,
  PromptCard,
};

export class Registry extends Context.Service<
  Registry,
  {
    readonly lookup: (name: ElementType) => Option.Option<valueOf<typeof registry>>;
  }
>()("Registry") {
  static readonly Live = Layer.succeed(Registry, {
    lookup: (name: ElementType) => {
      return Option.fromNullOr(registry[name]);
    },
  });
}