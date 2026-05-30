import { Schema } from "effect"

export const OtlpLogRecord = Schema.Struct({
  timeUnixNano: Schema.optionalKey(Schema.String),
  severityNumber: Schema.optionalKey(Schema.Number),
  severityText: Schema.optionalKey(Schema.String),
  body: Schema.String,
  attributes: Schema.optionalKey(Schema.Array(Schema.Struct({
    key: Schema.String,
    value: Schema.Unknown,
  }))),
  traceId: Schema.optionalKey(Schema.String),
  spanId: Schema.optionalKey(Schema.String),
})

export type OtlpLogRecord = typeof OtlpLogRecord.Type