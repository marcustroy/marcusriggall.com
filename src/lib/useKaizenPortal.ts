'use client';

import { useEffect, useState } from 'react';

// Kaizen menus render in a portal on <body>, outside the .kaizen-scope wrapper that carries its design tokens.
// This gives them a scoped container of their own to render into, so they are styled but not clipped by a panel.
export function useKaizenPortal() {
  const [container, setContainer] = useState<HTMLElement | undefined>();

  useEffect(() => {
    const element = document.createElement('div');
    element.className = 'kaizen-scope';
    document.body.appendChild(element);
    setContainer(element);
    return () => {
      element.remove();
      setContainer(undefined);
    };
  }, []);

  return container;
}
