'use client';

import { Icon, MenuItem } from '@kaizen/components';

// A Kaizen menu item that shows it is the current choice: blue, semibold, with a tick at the right.
export default function MenuOption({ id, selected, children }: { id: string; selected: boolean; children: string }) {
  return (
    <MenuItem id={id}>
      <span
        className="flex w-full items-center justify-between gap-8"
        style={selected ? { color: 'var(--color-blue-500)', fontWeight: 600 } : undefined}
      >
        {children}
        {selected && <Icon name="check" isPresentational />}
      </span>
    </MenuItem>
  );
}
