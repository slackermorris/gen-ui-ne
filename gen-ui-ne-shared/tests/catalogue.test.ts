import { describe, expect, it } from 'vite-plus/test';
import { Catalogue } from '../catalogue.ts';
import { PromptCardProps } from '../component-schema.ts';
import { Schema } from 'effect';
import { SchemaError } from 'effect/Schema';

describe('Catalogue', () => {
  it('serves an llm friendly prompt of itself', () => {
    expect(new Catalogue([PromptCardProps]).toPrompt()).toMatchInlineSnapshot(
      `"PromptCard: {"type":"object","properties":{"title":{"type":"string"},"message":{"type":"string"},"action":{"type":"string"}},"required":["title","message"],"additionalProperties":false} - Displays a prompt card with title, message and optional action"`,
    );
  });

  it('successfully transforms itself to a Spec format', () => {
    const SpecElements = new Catalogue([PromptCardProps]).toSpecElements();

    const specElementToDecode = {
      id: 'unique-id',
      type: 'PromptCard',
      props: { title: 'Add funds', message: 'Top up', action: 'Add' },
      description: 'catalogue-only field that should be projected away',
    };

    expect(Schema.decodeUnknownSync(SpecElements)(specElementToDecode)).toStrictEqual({
      id: 'unique-id',
      type: 'PromptCard',
      props: { title: 'Add funds', message: 'Top up', action: 'Add' },
    });
  });

  it('throws an error when deriving Spec from malformed catalogue', () => {
    const SpecElements = new Catalogue([PromptCardProps]).toSpecElements();

    const specElementToDecode = {
      nonCatalogueElementField: 'id',
    };

    expect(() => Schema.decodeUnknownSync(SpecElements)(specElementToDecode)).toThrow(SchemaError);
  });
});
