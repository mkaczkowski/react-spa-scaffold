import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { create } from 'zustand';

import { createSelectors } from './createSelectors';

interface TestState {
  count: number;
  name: string;
  increment: () => void;
  setName: (name: string) => void;
}

describe('createSelectors', () => {
  it('creates auto-generated selectors for all state properties', () => {
    const useStoreBase = create<TestState>()((set) => ({
      count: 0,
      name: 'test',
      increment: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name }),
    }));

    const useStore = createSelectors(useStoreBase);

    // Verify .use namespace exists
    expect(useStore.use).toBeDefined();
    expect(typeof useStore.use.count).toBe('function');
    expect(typeof useStore.use.name).toBe('function');
    expect(typeof useStore.use.increment).toBe('function');
    expect(typeof useStore.use.setName).toBe('function');
  });

  it('selectors return correct state values', () => {
    const useStoreBase = create<TestState>()((set) => ({
      count: 42,
      name: 'hello',
      increment: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name }),
    }));

    const useStore = createSelectors(useStoreBase);

    const { result: countResult } = renderHook(() => useStore.use.count());
    const { result: nameResult } = renderHook(() => useStore.use.name());

    expect(countResult.current).toBe(42);
    expect(nameResult.current).toBe('hello');
  });

  it('selectors return action functions', () => {
    const useStoreBase = create<TestState>()((set) => ({
      count: 0,
      name: 'test',
      increment: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name }),
    }));

    const useStore = createSelectors(useStoreBase);

    const { result: incrementResult } = renderHook(() => useStore.use.increment());
    const { result: setNameResult } = renderHook(() => useStore.use.setName());

    expect(typeof incrementResult.current).toBe('function');
    expect(typeof setNameResult.current).toBe('function');
  });

  it('actions from selectors update state correctly', () => {
    const useStoreBase = create<TestState>()((set) => ({
      count: 0,
      name: 'initial',
      increment: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name }),
    }));

    const useStore = createSelectors(useStoreBase);

    // Get initial state
    expect(useStore.getState().count).toBe(0);
    expect(useStore.getState().name).toBe('initial');

    // Use action from selector
    const { result: incrementResult } = renderHook(() => useStore.use.increment());

    act(() => {
      incrementResult.current();
    });

    expect(useStore.getState().count).toBe(1);

    // Use another action
    const { result: setNameResult } = renderHook(() => useStore.use.setName());

    act(() => {
      setNameResult.current('updated');
    });

    expect(useStore.getState().name).toBe('updated');
  });

  it('preserves original store functionality', () => {
    const useStoreBase = create<TestState>()((set) => ({
      count: 0,
      name: 'test',
      increment: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name }),
    }));

    const useStore = createSelectors(useStoreBase);

    // Original hook still works
    const { result } = renderHook(() => useStore((state) => state.count));
    expect(result.current).toBe(0);

    // getState still works
    expect(useStore.getState().count).toBe(0);

    // setState still works
    act(() => {
      useStore.setState({ count: 100 });
    });
    expect(useStore.getState().count).toBe(100);

    // subscribe still works
    let subscribedValue = 0;
    const unsub = useStore.subscribe((state) => {
      subscribedValue = state.count;
    });

    act(() => {
      useStore.setState({ count: 200 });
    });
    expect(subscribedValue).toBe(200);

    unsub();
  });
});
