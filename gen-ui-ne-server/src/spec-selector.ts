import { WorkerEntrypoint } from 'cloudflare:workers';
import { generateText, jsonSchema, Output } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { Catalogue } from 'gen-ui-ne-shared/catalogue';

import { Spec, SpecJsonSchema } from 'gen-ui-ne-shared/model';
import type { Orchestrator } from './index';

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
		Catalogue.toPrompt(),
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

		console.log('logging the system prompt', buildSystemPrompt())

		const { output } = await generateText({
			model: anthropic('claude-haiku-4-5-20251001'),
			// TODO: might have to make the schema conform 
			output: Output.object({ schema: jsonSchema<typeof Spec.Type>(SpecJsonSchema) }),
			system: buildSystemPrompt(),
			prompt: `${userContext}${logContext}`,
		});

		return output;
	}
}
