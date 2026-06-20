/**
 * Anthropic compiles a structured-output JSON Schema into a constrained-decoding
 * grammar, and that grammar has a hard size limit ("The compiled grammar is too
 * large"). Two constructs blow the budget for our component catalogue:
 *
 *   1. Nullable unions — `anyOf: [X, { type: "null" }]`. Anthropic caps these at
 *      16 per request and documents them as exponentially expensive. Effect
 *      emits one for every optional / defaulted field.
 *   2. Non-finite number branches — Effect encodes `Schema.Number` as
 *      `anyOf: [{ type: "number" }, { type: "string", enum: ["NaN"] }, ...]`
 *      because JSON has no NaN/Infinity. Three junk branches per number.
 *
 * Neither is needed for generation: the model is told to omit optional fields,
 * and it can't emit NaN/Infinity anyway. This strips both so the grammar fits,
 * without touching the canonical Effect schemas (which still validate on decode).
 *
 * See https://github.com/anthropics/anthropic-sdk-python/issues/1185
 */

const NON_FINITE_NUMBER_STRINGS = new Set(["NaN", "Infinity", "-Infinity"]);

function isNullSchema(node: unknown): boolean {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as Record<string, unknown>).type === "null"
  );
}

/** A branch like `{ type: "string", enum: ["NaN"] }` that Effect adds for non-finite numbers. */
function isNonFiniteNumberSchema(node: unknown): boolean {
  if (typeof node !== "object" || node === null) return false;
  const n = node as Record<string, unknown>;
  return (
    n.type === "string" &&
    Array.isArray(n.enum) &&
    n.enum.length > 0 &&
    n.enum.every(
      (v) => typeof v === "string" && NON_FINITE_NUMBER_STRINGS.has(v),
    )
  );
}

/**
 * Recursively remove grammar-exploding constructs from a JSON Schema so it stays
 * within Anthropic's constrained-decoding limits. Returns a new object; the
 * input is not mutated.
 */
export function sanitizeForStrictGrammar<T>(schema: T): T {
  return visit(schema) as T;
}

function visit(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(visit);
  if (typeof node !== "object" || node === null) return node;

  // Recurse into children first so nested unions collapse before we inspect this level.
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    result[key] = visit(value);
  }

  // Drop "null" from array-form types: `type: ["string", "null"]` -> `type: "string"`.
  if (Array.isArray(result.type)) {
    const types = result.type.filter((t) => t !== "null");
    result.type = types.length === 1 ? types[0] : types;
  }

  // Prune null + non-finite-number branches from anyOf, collapsing to the lone survivor.
  if (Array.isArray(result.anyOf)) {
    let members = result.anyOf.filter(
      (member) => !isNullSchema(member) && !isNonFiniteNumberSchema(member),
    );

    // Never empty the union out entirely (defensive — shouldn't happen for our schemas).
    if (members.length === 0) members = result.anyOf;

    if (members.length === 1) {
      const { anyOf: _dropped, ...siblings } = result;
      // Inline the sole branch, letting sibling keywords (description, etc.) win.
      return { ...(members[0] as Record<string, unknown>), ...siblings };
    }

    result.anyOf = members;
  }

  return result;
}
