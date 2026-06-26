import { Schema } from 'effect';
import { describe, expect, it } from 'vite-plus/test';
import { Spec } from './spec.ts';
import { SchemaError } from 'effect/Schema';

describe('Spec', () => {
  it('decodes a valid Spec, hoists Stack children and applies prop defaults', () => {
    expect(
      Schema.decodeUnknownSync(Spec)({
        root: 'root',
        elements: {
          root: {
            type: 'Stack',
            props: {}, // direction/gap/align are filled in by decoding defaults
            children: ['portfolio'], // children live at the element top level, NOT inside props
          },
          portfolio: {
            type: 'PortfolioValue',
            props: {
              value: '$1,000.00',
              change: '+$10.00',
              changePercent: '+1.0%',
              direction: 'positive',
            },
          },
        },
      }),
    ).toEqual({
      root: 'root',
      elements: {
        root: {
          type: 'Stack',
          props: { direction: 'vertical', gap: 'md', align: 'stretch' },
          children: ['portfolio'],
        },
        portfolio: {
          type: 'PortfolioValue',
          props: {
            value: '$1,000.00',
            change: '+$10.00',
            changePercent: '+1.0%',
            direction: 'positive',
          },
        },
      },
    });
  });

  it('drops children placed inside props (they belong at the element top level)', () => {
    expect(
      Schema.decodeUnknownSync(Spec)({
        root: 'root',
        elements: {
          root: {
            type: 'Stack',
            props: { children: ['portfolio'] }, // wrong place: dropped
          },
          portfolio: {
            type: 'PortfolioValue',
            props: {
              value: '$1,000.00',
              change: '+$10.00',
              changePercent: '+1.0%',
              direction: 'positive',
            },
          },
        },
      }),
    ).toEqual({
      root: 'root',
      elements: {
        root: {
          type: 'Stack',
          props: { direction: 'vertical', gap: 'md', align: 'stretch' },
        },
        portfolio: {
          type: 'PortfolioValue',
          props: {
            value: '$1,000.00',
            change: '+$10.00',
            changePercent: '+1.0%',
            direction: 'positive',
          },
        },
      },
    });
  });

  it('rejects an element with an unknown component type', () => {
    expect(() =>
      Schema.decodeUnknownSync(Spec)({
        root: 'root',
        elements: {
          root: { type: 'NotARealComponent', props: {} },
        },
      }),
    ).toThrow(SchemaError);
  });
});
