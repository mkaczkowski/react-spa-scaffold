import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

import { MobileProvider } from '@/contexts/mobileContext';

// Setup empty English catalog for tests
i18n.loadAndActivate({ locale: 'en', messages: {} });

interface WrapperProps {
  children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  return (
    <I18nProvider i18n={i18n}>
      <MemoryRouter>
        <MobileProvider>{children}</MobileProvider>
      </MemoryRouter>
    </I18nProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
