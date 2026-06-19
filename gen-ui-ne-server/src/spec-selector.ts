import { writeFileSync } from 'node:fs';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { generateText, jsonSchema, Output } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { Catalogue } from 'gen-ui-ne-shared/catalogue';

import { Spec } from 'gen-ui-ne-shared/model';
import { Components } from '../../gen-ui-ne-shared/component-schema';

import type { Orchestrator } from './index';
import { JsonSchema, Result, Schema } from 'effect';

interface Env {
	ANTHROPIC_API_KEY: string;
	ORCHESTRATOR: DurableObjectNamespace<Orchestrator>;
}

function buildSystemPrompt() {
	return [
		'You are a UI spec generator for a personalised investment dashboard called Sharesies.',
		'',
		'Respond with ONLY a raw JSON object (no markdown, no code fences). The JSON has two fields:',
		'- root: the id of the root Stack element',
		'- elements: an object mapping element ids to element definitions',
		'',
		'Each element has a "type" and a "props" object matching the schema shown below.',
		'',
		'Available components:',
		new Catalogue(Components).toPrompt(),
		'',
		'Rules:',
		'- root Stack must have props.direction "vertical"',
		'- all ids in children must exist as keys in elements',
		'- use the exact prop field names shown in the schema above',
		'- omit optional fields — never set them to null',
	].join('\n');
}

export default {} satisfies ExportedHandler<Env>;
export class SpecSelector extends WorkerEntrypoint<Env> {
	async generate(name: string, userContext: string): Promise<typeof Spec.Type> {
		const anthropic = createAnthropic({ apiKey: this.env.ANTHROPIC_API_KEY });

		const stub = this.env.ORCHESTRATOR.getByName(name);
		const logs = await stub.getRecentLogs(50);

		const logContext = logs.length > 0 ? `\n\nRecent activity logs:\n${JSON.stringify(logs, null, 2)}` : '';

		// const specAsJson = Schema.toJsonSchemaDocument(Spec);
		// const specAsJson7 = JsonSchema.toDocumentDraft07(specAsJson);
		// const aiCompatibleSchema = jsonSchema(specAsJson7['definitions']['Spec']);

		// console.log(JSON.stringify(aiCompatibleSchema));

		const { output } = await generateText({
			model: anthropic('claude-haiku-4-5-20251001'),
			output: Output.object({ schema: Schema.toStandardSchemaV1(Spec) }),
			system: buildSystemPrompt(),
			prompt: `${userContext}${logContext}`,
		});

		console.log('logging the output', { output });

		return Schema.decodeUnknownSync(Spec)(jsonSpecToDecode);
	}
}

const jsonSpecToDecode = {
	root: 'main_stack',
	elements: {
		main_stack: {
			type: 'Stack',
			props: {
				direction: 'vertical',
				gap: 'md',
			},
			children: ['header_stack', 'portfolio_section', 'risk_section', 'getting_started_card', 'beginner_options_grid'],
		},
		header_stack: {
			type: 'Stack',
			props: {
				direction: 'vertical',
				gap: 'sm',
			},
			children: ['welcome_text', 'portfolio_value'],
		},
		welcome_text: {
			type: 'Stack',
			props: {
				direction: 'vertical',
			},
			children: [],
		},
		portfolio_value: {
			type: 'PortfolioValue',
			props: {
				value: '$0.00',
				change: '$0.00',
				changePercent: '0%',
				direction: 'neutral',
			},
		},
		portfolio_section: {
			type: 'Stack',
			props: {
				direction: 'vertical',
				gap: 'sm',
			},
			children: ['portfolio_title', 'no_holdings_prompt'],
		},
		portfolio_title: {
			type: 'Stack',
			props: {
				direction: 'vertical',
			},
			children: [],
		},
		no_holdings_prompt: {
			type: 'PromptCard',
			props: {
				title: 'Ready to start investing?',
				message:
					"You haven't made any purchases yet. Begin your investment journey with beginner-friendly options that match your moderate-low risk profile.",
			},
		},
		risk_section: {
			type: 'Stack',
			props: {
				direction: 'horizontal',
				gap: 'md',
				align: 'center',
			},
			children: ['risk_indicator', 'risk_description'],
		},
		risk_indicator: {
			type: 'RiskIndicator',
			props: {
				rating: 3,
				label: 'Your Risk Profile',
			},
		},
		risk_description: {
			type: 'Stack',
			props: {
				direction: 'vertical',
				gap: 'sm',
			},
			children: [],
		},
		getting_started_card: {
			type: 'PromptCard',
			props: {
				title: 'Getting Started Guide',
				message: 'Learn about index funds, bonds, and diversified ETFs—low-to-moderate risk investments perfect for beginners like you.',
				action: 'Explore beginner tips',
			},
		},
		beginner_options_grid: {
			type: 'Grid',
			props: {
				columns: 2,
				gap: 'md',
			},
			children: ['index_funds_card', 'etf_card', 'bonds_card', 'diversified_card'],
		},
		index_funds_card: {
			type: 'PromptCard',
			props: {
				title: 'Index Funds',
				message: 'Diversified, low-cost way to track market performance with minimal risk.',
			},
		},
		etf_card: {
			type: 'PromptCard',
			props: {
				title: 'ETFs',
				message: 'Exchange-traded funds offering easy diversification and flexibility.',
			},
		},
		bonds_card: {
			type: 'PromptCard',
			props: {
				title: 'Bonds',
				message: 'Fixed income securities providing steady, lower-risk returns.',
			},
		},
		diversified_card: {
			type: 'PromptCard',
			props: {
				title: 'Diversified Portfolios',
				message: 'Pre-built portfolios balanced for your risk level.',
			},
		},
	},
};
