import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Syncs local state with an external value, but only when not actively editing.
 * Prevents external updates from overwriting user input mid-edit.
 *
 * @param externalValue - The external/server value to sync from
 * @param isActive - Whether the user is currently editing (blocks sync)
 */
export function useSyncedState<T>(externalValue: T, isActive: boolean): [T, Dispatch<SetStateAction<T>>] {
  const [localValue, setLocalValue] = useState<T>(externalValue);
  const prevIsActiveRef = useRef(isActive);

  // Sync external value to local state when:
  // 1. Not active (external updates flow through)
  // 2. Activity state changed (sync on open/close transitions)
  // This is an intentional pattern for synchronizing external props to local state
  useEffect(() => {
    const activityChanged = prevIsActiveRef.current !== isActive;

    if (!isActive || activityChanged) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional sync pattern
      setLocalValue(externalValue);
    }

    prevIsActiveRef.current = isActive;
  }, [externalValue, isActive]);

  return [localValue, setLocalValue];
}
