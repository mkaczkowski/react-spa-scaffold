import type { PatternMap } from './types.js';

export const testPatterns: PatternMap = {
  'test-component': {
    file: 'src/components/layout/Header.test.tsx',
    description: 'Component test with Testing Library',
    keyPoints: [
      'Import from vitest (describe, it, expect)',
      'Custom render from @/test',
      'screen queries (getByRole, getByText)',
      'Semantic role assertions',
      'Co-located with component source file',
    ],
  },
  'test-hook': {
    file: 'src/hooks/useMediaQuery.test.ts',
    description: 'Hook test with renderHook',
    keyPoints: [
      'renderHook from Testing Library',
      'mockMatchMedia utility',
      'beforeEach for setup',
      'it.each for parameterized tests',
      'act() for state updates',
      'Co-located with hook source file',
    ],
  },
  'test-store': {
    file: 'src/stores/preferencesStore.test.ts',
    description: 'Zustand store test',
    keyPoints: [
      'Direct store access: useStore.getState()',
      'act() wrapper for state changes',
      'Reset state in beforeEach',
      'Test actions and computed values',
      'Co-located with store source file',
    ],
  },
  'test-utility': {
    file: 'src/lib/utils.test.ts',
    description: 'Utility function test',
    keyPoints: ['Simple describe/it/expect pattern', 'Test edge cases', 'No mocking needed'],
  },
  'msw-handler': {
    file: 'src/mocks/handlers/todos.ts',
    description: 'MSW request handler',
    keyPoints: [
      'http.get/post from msw',
      'HttpResponse.json() for responses',
      'URL parameter extraction',
      'delay() for realistic timing',
      'Error responses with status codes',
    ],
  },
  'test-fixture': {
    file: 'src/mocks/fixtures/todos.ts',
    description: 'Test data fixtures',
    keyPoints: ['Typed mock data', 'Realistic test values', 'Reusable across tests'],
  },
};
