import { Schema, SchemaTransformation } from "effect"

export const OtlpLogRecord = Schema.Struct({
  timeUnixNano: Schema.optionalKey(Schema.String),
  observedTimeUnixNano: Schema.optionalKey(Schema.String),
  severityNumber: Schema.optionalKey(Schema.Number),
  severityText: Schema.optionalKey(Schema.String),
  body: Schema.optionalKey(Schema.Unknown),
  attributes: Schema.optionalKey(Schema.Array(Schema.Struct({
    key: Schema.String,
    value: Schema.Unknown,
  }))),
  traceId: Schema.optionalKey(Schema.String),
  spanId: Schema.optionalKey(Schema.String),
})

export type OtlpLogRecord = typeof OtlpLogRecord.Type


export const LogInsertDto = Schema.Struct({
	// epoch milliseconds (converted from timeUnixNano)
	ts: Schema.Number,
	// OTLP severity number (9=Info, 13=Warn, 17=Error)
	severity: Schema.Number,
	// the log message/event name
	body: Schema.String,
	trace_id: Schema.NullOr(Schema.String),
	span_id: Schema.NullOr(Schema.String),
	// flattened key-value JSON: {"user.action":"view_portfolio","component":"AllocationBar"}
	attributes: Schema.String,
});

export type LogInsertDto = typeof LogInsertDto.Type;

export const OtlpLogRecordToLogInsertDto = OtlpLogRecord.pipe(
  Schema.decodeTo(
    LogInsertDto,
    SchemaTransformation.transform({
      decode: record => ({
        ts: record.timeUnixNano ? Math.floor(Number(record.timeUnixNano) / 1_000_000) : Date.now(),
        severity: record.severityNumber ?? 9,
        body: typeof record.body == 'string' ? record.body : JSON.stringify(record.body ?? null),
        trace_id: record.traceId ?? null,
        span_id: record.spanId ?? null,
        attributes: JSON.stringify(Object.fromEntries((record.attributes ?? []).map(({ key, value}) => [key, value])))
      }),
      encode: dto => ({ body: dto.body })
    })
  )
)
