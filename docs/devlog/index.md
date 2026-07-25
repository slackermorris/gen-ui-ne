# Devlog

Obstacles hit while building gen-ui-ne, and what came of them. Mostly the places where the platform did not allow what the architecture wanted — kept because the workarounds shaped the design.

| Date       | Entry                                                                                                            | What it cost                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2026-07-21 | [Limitations using schemas with the Anthropic API](./limitations-using-schemas-with-anthropic-api/index.md)       | Reshaped the `Spec` from an open-ended map to an array; killed optionality across component props |
| 2026-07-21 | [Anthropic constrained decoding nearly unusable](./anthropic-constrained-decoding-nearly-unusable/index.md)       | Abandoned constrained decoding; `Spec` moved into the system prompt with a retry loop |

Both entries are about the same underlying wall — Anthropic compiles a grammar from the schema you hand it for constrained decoding, and that grammar has hard size limits. The first entry is the running account of fighting it; the second isolates the failure mode.
