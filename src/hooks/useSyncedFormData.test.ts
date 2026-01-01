import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSyncedFormData } from './useSyncedFormData';

describe('useSyncedFormData', () => {
  it('returns source data initially', () => {
    const { result } = renderHook(() => useSyncedFormData({ name: 'test' }, 'trigger-1'));
    expect(result.current[0]).toEqual({ name: 'test' });
  });

  it('updates form data via setter', () => {
    const { result } = renderHook(() => useSyncedFormData({ name: 'initial' }, 'trigger-1'));

    act(() => {
      result.current[1]({ name: 'updated' });
    });

    expect(result.current[0]).toEqual({ name: 'updated' });
  });

  it('syncs when trigger value changes', () => {
    const { result, rerender } = renderHook(
      ({ sourceData, syncTrigger }) => useSyncedFormData(sourceData, syncTrigger),
      { initialProps: { sourceData: { name: 'v1' }, syncTrigger: 'trigger-1' } },
    );

    // Make local edit
    act(() => {
      result.current[1]({ name: 'local-edit' });
    });
    expect(result.current[0]).toEqual({ name: 'local-edit' });

    // Trigger changes - should sync back to source data
    rerender({ sourceData: { name: 'v2' }, syncTrigger: 'trigger-2' });
    expect(result.current[0]).toEqual({ name: 'v2' });
  });

  it('does not sync when source data changes without trigger change', () => {
    const { result, rerender } = renderHook(
      ({ sourceData, syncTrigger }) => useSyncedFormData(sourceData, syncTrigger),
      { initialProps: { sourceData: { name: 'v1' }, syncTrigger: 'trigger-1' } },
    );

    // Make local edit
    act(() => {
      result.current[1]({ name: 'local-edit' });
    });

    // Source data changes but trigger is the same
    rerender({ sourceData: { name: 'v2' }, syncTrigger: 'trigger-1' });
    expect(result.current[0]).toEqual({ name: 'local-edit' });
  });

  it('handles dialog open/close pattern (boolean trigger)', () => {
    const { result, rerender } = renderHook(
      ({ sourceData, syncTrigger }) => useSyncedFormData(sourceData, syncTrigger),
      { initialProps: { sourceData: { name: 'original' }, syncTrigger: false } },
    );

    // Dialog opens
    rerender({ sourceData: { name: 'original' }, syncTrigger: true });
    expect(result.current[0]).toEqual({ name: 'original' });

    // Edit form data
    act(() => {
      result.current[1]({ name: 'edited' });
    });
    expect(result.current[0]).toEqual({ name: 'edited' });

    // Dialog closes
    rerender({ sourceData: { name: 'original' }, syncTrigger: false });
    expect(result.current[0]).toEqual({ name: 'original' });

    // Dialog reopens with new data
    rerender({ sourceData: { name: 'new-data' }, syncTrigger: true });
    expect(result.current[0]).toEqual({ name: 'new-data' });
  });

  it('handles ID-based trigger pattern', () => {
    const { result, rerender } = renderHook(
      ({ sourceData, syncTrigger }) => useSyncedFormData(sourceData, syncTrigger),
      { initialProps: { sourceData: { name: 'item-1' }, syncTrigger: 'id-1' } },
    );

    // Edit item 1
    act(() => {
      result.current[1]({ name: 'edited-1' });
    });

    // Switch to item 2
    rerender({ sourceData: { name: 'item-2' }, syncTrigger: 'id-2' });
    expect(result.current[0]).toEqual({ name: 'item-2' });

    // Edit item 2
    act(() => {
      result.current[1]({ name: 'edited-2' });
    });

    // Switch back to item 1 (with original data)
    rerender({ sourceData: { name: 'item-1' }, syncTrigger: 'id-1' });
    expect(result.current[0]).toEqual({ name: 'item-1' });
  });
});
