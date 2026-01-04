import { waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, setMockClerkSignedIn, resetClerkMocks } from '@/test';

import { ProfileSync } from './ProfileSync';

// Mock the hooks
const mockMutate = vi.fn();
vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useCurrentProfile: vi.fn(() => ({ data: [], isLoading: false })),
    useUpsertProfile: vi.fn(() => ({ mutate: mockMutate, isPending: false })),
  };
});

describe('ProfileSync', () => {
  beforeEach(() => {
    resetClerkMocks();
    mockMutate.mockClear();
  });

  it('renders nothing (invisible)', () => {
    setMockClerkSignedIn(true);
    const { container } = render(<ProfileSync />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not sync when signed out', async () => {
    setMockClerkSignedIn(false);
    render(<ProfileSync />);
    await waitFor(() => expect(mockMutate).not.toHaveBeenCalled());
  });

  it('syncs profile when signed in', async () => {
    setMockClerkSignedIn(true);
    render(<ProfileSync />);
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({ id: 'user_123' }), expect.any(Object));
    });
  });
});
