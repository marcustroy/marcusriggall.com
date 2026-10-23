'use client';

import { useState, useCallback, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { DesignerItem } from './content';

export type DemoPhase =
  | 'idle'
  | 'promptingName'
  | 'addingDesigner'
  | 'designerAdded'
  | 'creatingPrototype'
  | 'prototypeCreated';

export interface TerminalMessage {
  id: string;
  type: 'command' | 'output' | 'success' | 'tool' | 'tool-result';
  text: string;
  toolName?: string;
  toolStatus?: 'running' | 'done';
}

interface SandboxDemoState {
  phase: DemoPhase;
  terminalMessages: TerminalMessage[];
  showNewDesigner: boolean;
  showNewPrototype: boolean;
  buildProgress: number;
  showPreview: boolean;
  customDesignerName: string;
}

// Generate initials from a name
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Generate a consistent color from a name
function getColorFromName(name: string): string {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const NEW_PROTOTYPE = {
  id: 7,
  name: 'Team Pulse',
  thumbnail: '#3B82F6',
};

export function useSandboxDemo() {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<SandboxDemoState>({
    phase: 'idle',
    terminalMessages: [],
    showNewDesigner: false,
    showNewPrototype: false,
    buildProgress: 0,
    showPreview: false,
    customDesignerName: '',
  });

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const scheduleTimeout = useCallback((fn: () => void, delay: number) => {
    const timeout = setTimeout(fn, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  }, []);

  const addMessage = useCallback((message: Omit<TerminalMessage, 'id'>) => {
    setState((prev) => ({
      ...prev,
      terminalMessages: [
        ...prev.terminalMessages,
        { ...message, id: `msg-${Date.now()}-${Math.random()}` },
      ],
    }));
  }, []);

  // Step 1: Show the name input prompt
  const promptForName = useCallback(() => {
    if (state.phase !== 'idle' && state.phase !== 'designerAdded' && state.phase !== 'prototypeCreated') return;

    clearTimeouts();
    setState((prev) => ({
      ...prev,
      phase: 'promptingName',
      terminalMessages: [],
      customDesignerName: '',
    }));

    addMessage({ type: 'command', text: '/add-designer' });
  }, [state.phase, clearTimeouts, addMessage]);

  // Step 2: Submit the name and run the animation
  const submitDesignerName = useCallback((name: string) => {
    if (state.phase !== 'promptingName') return;

    const trimmedName = name.trim() || 'You';

    setState((prev) => ({
      ...prev,
      phase: 'addingDesigner',
      customDesignerName: trimmedName,
    }));

    const timings = reducedMotion
      ? { cmd: 0, v1: 100, v2: 200, v3: 300, reveal: 400 }
      : { cmd: 0, v1: 400, v2: 700, v3: 1100, reveal: 1300 };

    scheduleTimeout(() => {
      addMessage({ type: 'command', text: `--name "${trimmedName}"` });
    }, timings.cmd);

    scheduleTimeout(() => {
      addMessage({ type: 'success', text: '✓ Validating designer...' });
    }, timings.v1);

    scheduleTimeout(() => {
      addMessage({ type: 'success', text: '✓ Creating profile...' });
    }, timings.v2);

    scheduleTimeout(() => {
      addMessage({ type: 'success', text: '✓ Designer added successfully' });
    }, timings.v3);

    scheduleTimeout(() => {
      setState((prev) => ({
        ...prev,
        phase: 'designerAdded',
        showNewDesigner: true,
      }));
    }, timings.reveal);
  }, [state.phase, reducedMotion, scheduleTimeout, addMessage]);

  // Helper to update a tool message status to 'done'
  const markToolDone = useCallback((toolName: string) => {
    setState((prev) => ({
      ...prev,
      terminalMessages: prev.terminalMessages.map((msg) =>
        msg.toolName === toolName && msg.toolStatus === 'running'
          ? { ...msg, toolStatus: 'done' as const }
          : msg
      ),
    }));
  }, []);

  const startAddPrototype = useCallback(() => {
    if (state.phase !== 'idle' && state.phase !== 'designerAdded' && state.phase !== 'prototypeCreated') return;

    clearTimeouts();
    setState((prev) => ({
      ...prev,
      phase: 'creatingPrototype',
      terminalMessages: [],
      showNewPrototype: false,
      buildProgress: 0,
      showPreview: false,
    }));

    const t = reducedMotion
      ? { base: 80, gap: 120 }
      : { base: 200, gap: 400 };

    let time = 0;

    // Command
    scheduleTimeout(() => {
      addMessage({ type: 'command', text: '/add-prototype "Build a team pulse feed that shows recent updates from people"' });
    }, time);
    time += t.base;

    // Agent thinking
    scheduleTimeout(() => {
      addMessage({ type: 'output', text: "I'll create a team pulse feed prototype for you." });
    }, time);
    time += t.gap;

    // Read existing feed component
    scheduleTimeout(() => {
      addMessage({ type: 'tool', text: 'src/components/Feed/FeedCard.tsx', toolName: 'read-1', toolStatus: 'running' });
    }, time);
    time += t.gap;

    scheduleTimeout(() => {
      markToolDone('read-1');
    }, time);
    time += t.base;

    // Write TeamPulseFeed
    scheduleTimeout(() => {
      addMessage({ type: 'tool', text: 'src/components/TeamPulseFeed.tsx', toolName: 'write-1', toolStatus: 'running' });
    }, time);
    time += t.gap;

    scheduleTimeout(() => {
      markToolDone('write-1');
    }, time);
    time += t.base;

    // Write ActivityCard
    scheduleTimeout(() => {
      addMessage({ type: 'tool', text: 'src/components/ActivityCard.tsx', toolName: 'write-2', toolStatus: 'running' });
    }, time);
    time += t.gap;

    scheduleTimeout(() => {
      markToolDone('write-2');
    }, time);
    time += t.base;

    // Write Avatar component
    scheduleTimeout(() => {
      addMessage({ type: 'tool', text: 'src/components/UserAvatar.tsx', toolName: 'write-3', toolStatus: 'running' });
    }, time);
    time += t.gap;

    scheduleTimeout(() => {
      markToolDone('write-3');
    }, time);
    time += t.base;

    // Edit page to add feed
    scheduleTimeout(() => {
      addMessage({ type: 'tool', text: 'src/pages/TeamPulse.tsx', toolName: 'edit-1', toolStatus: 'running' });
    }, time);
    time += t.gap;

    scheduleTimeout(() => {
      markToolDone('edit-1');
    }, time);
    time += t.base;

    // Run build
    scheduleTimeout(() => {
      addMessage({ type: 'tool', text: 'npm run build', toolName: 'bash-1', toolStatus: 'running' });
    }, time);
    time += t.gap + 200; // build takes longer

    scheduleTimeout(() => {
      markToolDone('bash-1');
      addMessage({ type: 'tool-result', text: '✓ Compiled successfully' });
    }, time);
    time += t.base;

    // Show preview
    scheduleTimeout(() => {
      setState((prev) => ({ ...prev, showPreview: true }));
    }, time);
    time += t.gap;

    // Commit and deploy
    scheduleTimeout(() => {
      addMessage({ type: 'tool', text: 'git add . && git commit -m "Add Team Pulse prototype"', toolName: 'bash-2', toolStatus: 'running' });
    }, time);
    time += t.gap;

    scheduleTimeout(() => {
      markToolDone('bash-2');
      addMessage({ type: 'success', text: 'Deployed to sandbox.cultureamp.net/team-pulse' });
    }, time);
    time += t.base;

    // Complete
    scheduleTimeout(() => {
      setState((prev) => ({
        ...prev,
        showNewPrototype: true,
        phase: 'prototypeCreated',
      }));
    }, time);
  }, [state.phase, reducedMotion, clearTimeouts, scheduleTimeout, addMessage, markToolDone]);

  const reset = useCallback(() => {
    clearTimeouts();
    setState({
      phase: 'idle',
      terminalMessages: [],
      showNewDesigner: false,
      showNewPrototype: false,
      buildProgress: 0,
      showPreview: false,
      customDesignerName: '',
    });
  }, [clearTimeouts]);

  // Generate the new designer object from the custom name
  const newDesigner: DesignerItem = {
    id: 7,
    name: state.customDesignerName || 'You',
    initials: getInitials(state.customDesignerName || 'You'),
    avatarColor: getColorFromName(state.customDesignerName || 'You'),
  };

  return {
    ...state,
    newDesigner,
    newPrototype: NEW_PROTOTYPE,
    promptForName,
    submitDesignerName,
    startAddPrototype,
    reset,
    isAnimating: state.phase === 'addingDesigner' || state.phase === 'creatingPrototype',
  };
}
