import { useLingui } from '@lingui/react/macro';
import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { toast } from '@/lib/toast';

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

/** Registers the service worker and shows toast notifications for PWA updates. Renders nothing. */
export function PWAUpdatePrompt() {
  const { t } = useLingui();
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      setInterval(() => {
        registration.update();
      }, UPDATE_CHECK_INTERVAL);
    },
  });

  useEffect(() => {
    const isInstalledPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (offlineReady && isInstalledPWA) {
      toast.success(t`App ready to work offline`);
    }
  }, [offlineReady, t]);

  useEffect(() => {
    if (needRefresh) {
      toast(t`New version available`, {
        duration: Infinity,
        action: {
          label: t`Reload`,
          onClick: () => updateServiceWorker(true),
        },
      });
    }
  }, [needRefresh, updateServiceWorker, t]);

  return null;
}
