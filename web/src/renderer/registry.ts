import type { ComponentType } from "react";
import { Stack } from "../components/layout/Stack";
import { Grid } from "../components/layout/Grid";
import { MetricCard } from "../components/MetricCard";
import { Sidebar } from "../components/Sidebar";
import { StatusBadge } from "../components/StatusBadge";
import { PortfolioValue } from "../components/investment/PortfolioValue";
import { ReturnBadge } from "../components/investment/ReturnBadge";
import { HoldingRow } from "../components/investment/HoldingRow";
import { AllocationBar } from "../components/investment/AllocationBar";
import { RiskIndicator } from "../components/investment/RiskIndicator";
import { AutoInvestCard } from "../components/investment/AutoInvestCard";
import { PromptCard } from "../components/investment/PromptCard";
import { Context, Layer, Option } from "effect";
import { valueOf } from "../utils/type-helper";

type ComponentRegistry = Record<string, ComponentType<any>>;

const registry: ComponentRegistry = {
  Stack,
  Grid,
  MetricCard,
  Sidebar,
  StatusBadge,
  PortfolioValue,
  ReturnBadge,
  HoldingRow,
  AllocationBar,
  RiskIndicator,
  AutoInvestCard,
  PromptCard,
};

export class Registry extends Context.Service<
  Registry,
  {
    readonly lookup: (name: string) => Option.Option<valueOf<ComponentRegistry>>;
  }
>()("Registry") {
  static readonly Live = Layer.succeed(Registry, {
    lookup: (name: string) => {
      return Option.fromNullOr(registry[name]);
    },
  });
}