There are some severe Limitations Using Schemas With Anthropic API Via Vercel AI SDK. So severe that I do not think I can achieve my ideal architecture.

The most recent of which is that Anthropic has a number of hard limits to the schema it can accept for constrained decoding.

```typescript
const { output } = await generateText({
  model: anthropic('claude-haiku-4-5-20251001'),
  output: Output.object({
    //     ┌─ Schema used for constraint decoding is limited.
    //     ▼
    schema: jsonSchema(SpecForLlm.toStrictAnthropicJsonSchema()),
  }),
  system: buildSystemPrompt(),
  prompt: `${userContext}${logContext}`,
});
```

The worst of these is a `Grammar too large` error. This is the true ceiling. At a certain point, the schema that we send to the model is too _large_. Essentially the grammar's cost, the ruleset for forcing the models output to conform to the schema, explodes with unboundedness. The cost is too large and so model rejects the request.

This renders the schema as being unusable. In fact, the only way to work with Anthropics' model is to codify the `Spec` as intended output in the original system prompt and write the models job as retry-able. This requires a considerably greater amount of boilerplate.

The complete set of variations of this error:

1. The schema is too open-ended. We observed this when the `Spec` was typed as `Record<ElementId, SpecElement>`, meaning it allowed for an unbounded set of keys.
2. Optional parameters. The optionality complicated the number of present/absent branches in the `Spec` schema. The branching was too expensive. Anthropic caps the count of optional properties to 23.
3. Grammar too large. The union of N component shapes summed into a state machine too big to compile.
