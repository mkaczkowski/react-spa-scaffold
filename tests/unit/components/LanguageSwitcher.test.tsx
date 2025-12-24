import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { render } from '@/test-utils';

describe('LanguageSwitcher', () => {
  it('renders the language button', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button', { name: /change language/i });
    expect(button).toBeInTheDocument();
  });

  it('opens dropdown menu on click', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button', { name: /change language/i });
    await user.click(button);

    // Should show language options
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('highlights current language in dropdown', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button', { name: /change language/i });
    await user.click(button);

    // English should be highlighted (default locale in tests)
    const englishOption = screen.getByText('English');
    expect(englishOption.closest('[data-slot="dropdown-menu-item"]')).toHaveClass('bg-accent');
  });
});
