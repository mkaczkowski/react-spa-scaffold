import type { ReactNode } from 'react';

// =============================================================================
// Mock State
// =============================================================================

interface ClerkMockState {
  isSignedIn: boolean;
  isLoaded: boolean;
}

const defaultState: ClerkMockState = {
  isSignedIn: true,
  isLoaded: true,
};

let mockState: ClerkMockState = { ...defaultState };

// =============================================================================
// Test Utilities
// =============================================================================

export function setMockSignedIn(value: boolean) {
  mockState.isSignedIn = value;
}

export function setMockLoaded(value: boolean) {
  mockState.isLoaded = value;
}

export function setMockClerkState(state: Partial<ClerkMockState>) {
  mockState = { ...mockState, ...state };
}

export function resetClerkMocks() {
  mockState = { ...defaultState };
}

// =============================================================================
// Mock Components
// =============================================================================

export function SignedIn({ children }: { children: ReactNode }) {
  return mockState.isLoaded && mockState.isSignedIn ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  return mockState.isLoaded && !mockState.isSignedIn ? <>{children}</> : null;
}

export function SignInButton({ children }: { children?: ReactNode; mode?: string }) {
  return <div data-testid="sign-in-button">{children}</div>;
}

export function SignUpButton({ children }: { children?: ReactNode; mode?: string }) {
  return <div data-testid="sign-up-button">{children}</div>;
}

export function UserButton() {
  return <button data-testid="user-button">User</button>;
}

export function RedirectToSignIn() {
  return <div data-testid="redirect-to-sign-in" />;
}

export function ClerkProvider({
  children,
}: {
  children: ReactNode;
  publishableKey?: string;
  afterSignOutUrl?: string;
  appearance?: unknown;
}) {
  return <>{children}</>;
}

// =============================================================================
// Mock Hooks
// =============================================================================

export function useAuth() {
  return {
    isLoaded: mockState.isLoaded,
    isSignedIn: mockState.isSignedIn,
    userId: mockState.isSignedIn ? 'user_123' : null,
    sessionId: mockState.isSignedIn ? 'sess_123' : null,
    getToken: async () => (mockState.isSignedIn ? 'mock-token' : null),
  };
}

export function useUser() {
  return {
    isLoaded: mockState.isLoaded,
    user: mockState.isSignedIn ? { id: 'user_123', firstName: 'Test', lastName: 'User' } : null,
  };
}
