import { WorkerEntrypoint } from 'cloudflare:workers';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

import type { Spec } from 'gen-ui-ne-shared/model';
import type { Orchestrator } from './index';

interface Env {
	ANTHROPIC_API_KEY: string;
	ORCHESTRATOR: DurableObjectNamespace<Orchestrator>;
}


function buildSystemPrompt() {
	const components = Object.entries(catalogue)
		.map(([type, entry]) => {
			const element = entry.example
				? `{"type":"${type}","props":${JSON.stringify(entry.example)}}`
				: `{"type":"${type}"}`;
			return `- ${type}: ${entry.description}\n  Schema: ${element}`;
		})
		.join('\n');

	return [
		'You are a UI spec generator for a personalised investment dashboard called Sharesies.',
		'',
		'Respond with ONLY a raw JSON object (no markdown, no code fences). The JSON has two fields:',
		'- root: the id of the root Stack element',
		'- elements: an object mapping element ids to element definitions',
		'',
		'Each element has a "type" and a "props" object matching the schema shown below.',
		'Stack and Grid also have a "children" array of element ids (no other components have children).',
		'',
		'Available components:',
		components,
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

		const { text } = await generateText({
			model: anthropic('claude-haiku-4-5-20251001'),
			system: buildSystemPrompt(),
			prompt: `${userContext}${logContext}`,
		});

		const json = text
			.replace(/^```(?:json)?\n?/, '')
			.replace(/\n?```$/, '')
			.trim();

		const parsed = JSON.parse(json);
		console.log('logging here', { parsed, json })

		return parsed;
	}
}
