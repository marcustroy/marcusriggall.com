'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

// A ?theme=light|dark link overrides the saved choice for that visit (the resume PDF is printed with ?theme=light).
// Runs before first paint (see layout.tsx) so a returning visitor never sees a flash of the wrong theme.
export const THEME_INIT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('theme');if(q==='light'||q==='dark'){document.documentElement.dataset.theme=q;return}var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t='dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`;

const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

// The attribute on <html> is the source of truth, so the store follows it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    // A short class lets colours ease across instead of snapping.
    root.classList.add('theme-switching');
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove('theme-switching'), 350);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }, []);

  return { theme, setTheme };
}
