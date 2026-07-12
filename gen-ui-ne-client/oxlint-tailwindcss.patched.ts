import basePlugin from "oxlint-tailwindcss";

const monkeyPatchPlugin = Object.assign(basePlugin, {});

type Rule = (typeof monkeyPatchPlugin)["rules"][string];
type RuleMessages = NonNullable<NonNullable<Rule["meta"]>["messages"]>;

const DESIGN_SYSTEM_HINT =
  " Use a design-system token instead. See the available utilities in root stylesheet";

const RULE_NAME = "no-unknown-classes";

const MESSAGE_KEYS = ["unknown", "unknownWithSuggestion", "missingPrefix"];

const rule: Rule = monkeyPatchPlugin.rules[RULE_NAME];

if (!rule.meta?.messages) {
  throw new Error("Rule does not have meta message block defined");
}

const messages: RuleMessages = rule.meta.messages;

if (messages) {
  for (const key of MESSAGE_KEYS) {
    if (typeof messages[key] === "string") {
      messages[key] += DESIGN_SYSTEM_HINT;
    }
  }
}

export default monkeyPatchPlugin;
