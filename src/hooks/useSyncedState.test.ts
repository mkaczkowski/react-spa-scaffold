import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSyncedState } from './useSyncedState';

describe('useSyncedState', () => {
  it('returns external value initially', () => {
    const { result } = renderHook(() => useSyncedState('initial', false));
    expect(result.current[0]).toBe('initial');
  });

  it('updates local value via setter', () => {
    const { result } = renderHook(() => useSyncedState('initial', false));

    act(() => {
      result.current[1]('local-change');
    });

    expect(result.current[0]).toBe('local-change');
  });

  it('syncs with external value when not active', () => {
    const { result, rerender } = renderHook(({ externalValue, isActive }) => useSyncedState(externalValue, isActive), {
      initialProps: { externalValue: 'v1', isActive: false },
    });

    expect(result.current[0]).toBe('v1');

    // External value changes while not active - should sync
    rerender({ externalValue: 'v2', isActive: false });
    expect(result.current[0]).toBe('v2');
  });

  it('does not sync with external value when active', () => {
    const { result, rerender } = renderHook(({ externalValue, isActive }) => useSyncedState(externalValue, isActive), {
      initialProps: { externalValue: 'v1', isActive: false },
    });

    // Set local value
    act(() => {
      result.current[1]('local-edit');
    });

    // Become active (editing)
    rerender({ externalValue: 'v1', isActive: true });

    // External value changes while active - should NOT sync
    rerender({ externalValue: 'v2', isActive: true });
    expect(result.current[0]).toBe('local-edit');
  });

  it('syncs when switching from active to inactive', () => {
    const { result, rerender } = renderHook(({ externalValue, isActive }) => useSyncedState(externalValue, isActive), {
      initialProps: { externalValue: 'v1', isActive: true },
    });

    // Make local edit while active
    act(() => {
      result.current[1]('local-edit');
    });
    expect(result.current[0]).toBe('local-edit');

    // External value changed while we were editing
    rerender({ externalValue: 'v2', isActive: true });
    expect(result.current[0]).toBe('local-edit');

    // Switch to inactive - should sync with new external value
    rerender({ externalValue: 'v2', isActive: false });
    expect(result.current[0]).toBe('v2');
  });

  it('works with complex objects', () => {
    const initial = { name: 'test', value: 1 };
    const { result, rerender } = renderHook(({ externalValue, isActive }) => useSyncedState(externalValue, isActive), {
      initialProps: { externalValue: initial, isActive: false },
    });

    expect(result.current[0]).toEqual(initial);

    const updated = { name: 'updated', value: 2 };
    rerender({ externalValue: updated, isActive: false });
    expect(result.current[0]).toEqual(updated);
  });
});
