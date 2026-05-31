import type { ElementType } from "./domain.ts";

type ComponentEntry = {
  description: string;
  example?: Record<string, unknown>;
};

export const catalogue: Record<ElementType, ComponentEntry> = {
  Stack: {
    description:
      "A flexible container that arranges children vertically or horizontally. Use to group related elements or structure page layout.",
    example: { direction: "vertical", gap: "md" },
  },
  Grid: {
    description:
      "A grid layout container. Use when displaying multiple items side by side, such as fund cards or summary metrics.",
    example: { columns: 2, gap: "md" },
  },
  PortfolioValue: {
    description:
      "Displays the investor's total portfolio value with a change amount and percentage. Use at the top of a dashboard to give an at-a-glance financial overview.",
    example: {
      value: "$12,340.00",
      change: "+$120.00",
      changePercent: "+0.98%",
      direction: "positive",
    },
  },
  ReturnBadge: {
    description:
      "A small badge showing a return figure with a direction indicator. Use to highlight a specific return metric inline or alongside a holding.",
    example: { value: "+5.2%", direction: "positive", label: "1Y return" },
  },
  AllocationBar: {
    description:
      "A segmented horizontal bar showing portfolio asset allocation by percentage. Use when showing how an investor's portfolio is divided across asset classes or funds.",
    example: {
      segments: [
        { label: "NZ Shares", percent: 40 },
        { label: "Global", percent: 60 },
      ],
    },
  },
  RiskIndicator: {
    description:
      "Displays the investor's risk rating on a 1–7 scale. Use to surface or reinforce risk profile awareness, especially when recommending funds.",
    example: { rating: 4, label: "Medium" },
  },
  HoldingRow: {
    description:
      "A single row showing one holding: name, ticker code, current value, and return percentage. Use inside a list to display multiple holdings.",
    example: {
      name: "NZ Top 50",
      code: "NZT50",
      value: "$4,250.00",
      returnPercent: "+12.3%",
      direction: "positive",
    },
  },
  AutoInvestCard: {
    description:
      "Shows an investor's auto-invest configuration: amount, frequency, and next scheduled date. Use when the investor has an active auto-invest and the context is relevant.",
    example: { amount: "$100", frequency: "weekly", nextDate: "12 Jun 2025" },
  },
  PromptCard: {
    description:
      "A call-to-action card with a title, message, and optional action label. Use to surface a recommendation, prompt, or insight the investor should act on.",
    example: {
      title: "Diversify your portfolio",
      message: "You're heavily weighted in NZ Shares.",
      action: "Explore funds",
    },
  },
};
