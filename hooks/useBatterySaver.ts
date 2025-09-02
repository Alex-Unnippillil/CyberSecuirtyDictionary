import { useEffect, useRef } from 'react';
import { Settings } from '../lib/settings';

/**
 * Detects low-power mode via the Battery Status API and toggles data saver and
 * reduced motion settings accordingly. A toast with an undo option lets users
 * revert the automatic change, and that choice is remembered for later.
 */
export default function useBatterySaver(
  settings: Settings,
  update: (changes: Partial<Settings>) => void,
) {
  const appliedRef = useRef(false);
  const prevRef = useRef({
    dataSaver: settings.dataSaver,
    reducedMotion: settings.reducedMotion,
  });

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
      return;
    }

    let battery: any = null;
    const overrideKey = 'batterySaverOverride';

    const showUndoToast = () => {
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '1rem';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = '#333';
      toast.style.color = '#fff';
      toast.style.padding = '0.5rem 1rem';
      toast.style.borderRadius = '4px';
      toast.style.zIndex = '1000';
      toast.textContent = 'Battery saver: data saver enabled';

      const undo = document.createElement('button');
      undo.textContent = 'Undo';
      undo.style.marginLeft = '0.5rem';
      undo.onclick = () => {
        update(prevRef.current);
        try {
          localStorage.setItem(overrideKey, 'true');
        } catch {}
        appliedRef.current = false;
        toast.remove();
      };

      toast.appendChild(undo);
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    };

    const handle = () => {
      const saver = !battery.charging && battery.level <= 0.2;
      if (saver && !appliedRef.current) {
        try {
          if (localStorage.getItem(overrideKey) === 'true') return;
        } catch {}
        prevRef.current = {
          dataSaver: settings.dataSaver,
          reducedMotion: settings.reducedMotion,
        };
        appliedRef.current = true;
        update({ dataSaver: true, reducedMotion: true });
        showUndoToast();
      } else if (!saver && appliedRef.current) {
        update(prevRef.current);
        appliedRef.current = false;
      }
    };

    (navigator as any).getBattery().then((b: any) => {
      battery = b;
      handle();
      b.addEventListener('levelchange', handle);
      b.addEventListener('chargingchange', handle);
    });

    return () => {
      battery?.removeEventListener('levelchange', handle);
      battery?.removeEventListener('chargingchange', handle);
    };
  }, [settings.dataSaver, settings.reducedMotion, update]);
}
