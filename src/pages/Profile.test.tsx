import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, resetClerkMocks, createProfile } from '@/test';

import { ProfilePage } from './Profile';

// Mock the hooks
const mockMutate = vi.fn();
const mockRefetch = vi.fn();

// Default mock profile
const defaultProfile = createProfile({
  full_name: 'Test User',
  email: 'test@example.com',
  avatar_url: 'https://example.com/avatar.jpg',
});

// Hook mock state
let mockProfileState: {
  profile: ReturnType<typeof createProfile> | null;
  isLoading: boolean;
  error: Error | null;
  exists: boolean;
  isFetching: boolean;
  refetch: typeof mockRefetch;
} = {
  profile: defaultProfile,
  isLoading: false,
  error: null,
  exists: true,
  isFetching: false,
  refetch: mockRefetch,
};

let mockUpdateState = {
  mutate: mockMutate,
  isPending: false,
  error: null as Error | null,
};

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useProfile: vi.fn(() => mockProfileState),
    useUpdateProfile: vi.fn(() => mockUpdateState),
  };
});

describe('ProfilePage', () => {
  beforeEach(() => {
    resetClerkMocks();
    mockMutate.mockClear();
    mockRefetch.mockClear();

    // Reset mock state to defaults
    mockProfileState = {
      profile: defaultProfile,
      isLoading: false,
      error: null,
      exists: true,
      isFetching: false,
      refetch: mockRefetch,
    };

    mockUpdateState = {
      mutate: mockMutate,
      isPending: false,
      error: null,
    };
  });

  it('renders profile page with title and description', () => {
    render(<ProfilePage />);
    // Verify both card title and description are present
    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByText(/manage your profile information/i)).toBeInTheDocument();
  });

  it('shows loading skeleton when profile is loading', () => {
    mockProfileState.isLoading = true;
    mockProfileState.profile = null;

    const { container } = render(<ProfilePage />);

    // Should show skeleton elements
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays profile data when loaded', () => {
    render(<ProfilePage />);

    // Name appears in header and name field - use getAllByText
    expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByAltText(/profile avatar/i)).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows avatar fallback when no avatar_url', () => {
    mockProfileState.profile = createProfile({
      full_name: 'John Doe',
      avatar_url: null,
    });

    render(<ProfilePage />);

    // Should show first letter of name as fallback
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('shows email initial when no name or avatar', () => {
    mockProfileState.profile = createProfile({
      full_name: null,
      email: 'user@example.com',
      avatar_url: null,
    });

    render(<ProfilePage />);

    // Should show first letter of email as fallback
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('shows error state and retry button on fetch failure', async () => {
    const user = userEvent.setup();
    mockProfileState.error = new Error('Network error');
    mockProfileState.profile = null;

    render(<ProfilePage />);

    expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    expect(screen.getByText(/network error/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('allows editing name field', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    // Should show input field
    const input = screen.getByRole('textbox', { name: /full name/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test User');
  });

  it('saves updated name via useUpdateProfile', async () => {
    const user = userEvent.setup();

    // Mock successful mutation
    mockMutate.mockImplementation((_data, options) => {
      options?.onSuccess?.();
    });

    render(<ProfilePage />);

    // Click edit
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Change name
    const input = screen.getByRole('textbox', { name: /full name/i });
    await user.clear(input);
    await user.type(input, 'New Name');

    // Click save
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ full_name: 'New Name' }, expect.any(Object));
    });
  });

  it('submits form on Enter key', async () => {
    const user = userEvent.setup();

    // Mock successful mutation
    mockMutate.mockImplementation((_data, options) => {
      options?.onSuccess?.();
    });

    render(<ProfilePage />);

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Change name and press Enter
    const input = screen.getByRole('textbox', { name: /full name/i });
    await user.clear(input);
    await user.type(input, 'Entered Name{Enter}');

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ full_name: 'Entered Name' }, expect.any(Object));
    });
  });

  it('shows saving state on button while updating', async () => {
    const user = userEvent.setup();
    mockUpdateState.isPending = true;

    render(<ProfilePage />);

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Should show saving state
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('cancel button reverts changes', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    // Click edit
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Change name
    const input = screen.getByRole('textbox', { name: /full name/i });
    await user.clear(input);
    await user.type(input, 'Changed Name');

    // Click cancel
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Should exit edit mode and show original name (appears multiple times)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
  });

  it('shows error message when update fails', async () => {
    const user = userEvent.setup();
    mockUpdateState.error = new Error('Update failed');

    render(<ProfilePage />);

    // Enter edit mode
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Should show error message
    expect(screen.getByText(/failed to update/i)).toBeInTheDocument();
    expect(screen.getByText(/update failed/i)).toBeInTheDocument();
  });

  it('shows "Not set" when name is empty', () => {
    mockProfileState.profile = createProfile({
      full_name: null,
      email: 'test@example.com',
    });

    render(<ProfilePage />);

    expect(screen.getByText(/not set/i)).toBeInTheDocument();
  });
});
