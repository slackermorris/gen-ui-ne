import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { Effect, Layer, Schema } from 'effect';
import { DurableObjectNamespace } from './services/durable-object-namespace';
import { Api } from 'gen-ui-ne-shared/api';
import { OtlpLogRecordToLogInsertDto } from './models/dto';
import { Spec } from 'gen-ui-ne-shared/model';

const rawSpec = {
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 'md' },
			children: ['portfolio', 'allocation', 'holdings', 'prompt'],
		},
		portfolio: {
			type: 'PortfolioValue',
			props: { value: '$12,340.00', change: '+$120.00', changePercent: '+0.98%', direction: 'positive' },
		},
		allocation: {
			type: 'AllocationBar',
			props: {
				segments: [
					{ label: 'NZ Shares', percent: 45 },
					{ label: 'Global', percent: 35 },
					{ label: 'Bonds', percent: 20 },
				],
			},
		},
		holdings: {
			type: 'Grid',
			props: { columns: 1, gap: 'sm' },
			children: ['h1', 'h2', 'h3'],
		},
		h1: {
			type: 'HoldingRow',
			props: { name: 'NZ Top 50', code: 'NZT50', value: '$5,420.00', returnPercent: '+12.3%', direction: 'positive' },
		},
		h2: {
			type: 'HoldingRow',
			props: { name: 'US 500', code: 'US500', value: '$4,890.00', returnPercent: '+8.1%', direction: 'positive' },
		},
		h3: {
			type: 'HoldingRow',
			props: { name: 'NZ Bonds', code: 'NZBND', value: '$2,030.00', returnPercent: '-0.4%', direction: 'negative' },
		},
		prompt: {
			type: 'PromptCard',
			props: { title: "You're on track", message: 'Portfolio up 0.98% today. Consider topping up.', action: 'Add funds' },
		},
	},
};

const BaseLive = HttpApiBuilder.group(Api, 'base', (handlers) =>
	handlers
		.handle('getUI', ({ params }) =>
			Effect.gen(function* () {
				const doNamespace = yield* DurableObjectNamespace;
				const stub = yield* doNamespace.getByName(params.name);
				// const raw = yield* Effect.promise(() => stub.getUi(params.name));

				// TODO: do not need to handle decoding the spec myself.. if anything, wouldn't this be encoding?
				return Schema.decodeUnknownSync(Spec)(rawSpec);
			}),
		)
		.handle('log', ({ params, payload }) =>
			Effect.gen(function* () {
				// TODO: add some logging
				const doNamespace = yield* DurableObjectNamespace;
				const stub = yield* doNamespace.getByName(params.name);
				const logs = Schema.decodeSync(Schema.Array(OtlpLogRecordToLogInsertDto))(payload.logs);

				yield* Effect.promise(() => stub.ingestLogs(logs));

				return {
					ok: true,
				};
			}),
		),
);

export const ApiLive = HttpApiBuilder.layer(Api).pipe(Layer.provide(BaseLive));
