'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button, Heading, Icon } from '@kaizen/components';
import { useReducedMotion } from '@/lib/useReducedMotion';
import '@/styles/kaizen.css';
import { coachFollowUps, coachPrompt, coachThemes, quadrantById, type QuadrantId } from './content';

// Gradient border from the Figma design (node 6:140): lavender at the top left to mint at the bottom right.
const COACH_GRADIENT = 'linear-gradient(135deg, #D3BDF0 0%, #9BF3E0 100%)';
const COACH_BORDER = `linear-gradient(var(--color-white), var(--color-white)) padding-box, ${COACH_GRADIENT} border-box`;

const STREAM_INTERVAL_MS = 18;
const STREAM_CHARS = 3;

interface Message {
  id: number;
  role: 'user' | 'coach';
  text: string;
  /** For coach messages: how much of the text has been revealed. */
  shown: number;
  loading?: boolean;
}

// Renders **bold** markers, hiding a half-typed marker while text streams in.
function RichText({ text }: { text: string }) {
  const clean = text.endsWith('*') && !text.endsWith('**') ? text.slice(0, -1) : text;
  return (
    <>
      {clean.split('**').map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function introText(quadrantId: QuadrantId) {
  const quadrant = quadrantById[quadrantId];
  const themes = coachThemes[quadrantId].map((theme) => `• ${theme}`).join('\n');
  return `Your organization sits in the **${quadrant.name}** quadrant.\n\nHere are the key themes I can see:\n${themes}`;
}

interface CoachPanelProps {
  quadrantId: QuadrantId;
  onClose: () => void;
}

export default function CoachPanel({ quadrantId, onClose }: CoachPanelProps) {
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(1);
  const followUpIndex = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const streamers = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    streamers.current.forEach(clearInterval);
    timers.current = [];
    streamers.current = [];
  };

  // Show a "thinking" state, then stream the reply in.
  const coachReply = (text: string) => {
    const id = nextId.current++;
    setMessages((m) => [...m, { id, role: 'coach', text, shown: 0, loading: true }]);
    const startStreaming = () => {
      if (reducedMotion) {
        setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, loading: false, shown: text.length } : msg)));
        return;
      }
      setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, loading: false } : msg)));
      const interval = setInterval(() => {
        setMessages((m) =>
          m.map((msg) => {
            if (msg.id !== id) return msg;
            const shown = Math.min(text.length, msg.shown + STREAM_CHARS);
            if (shown >= text.length) clearInterval(interval);
            return { ...msg, shown };
          })
        );
      }, STREAM_INTERVAL_MS);
      streamers.current.push(interval);
    };
    timers.current.push(setTimeout(startStreaming, reducedMotion ? 0 : 1400));
  };

  const startConversation = (quadrant: QuadrantId) => {
    clearTimers();
    followUpIndex.current = 0;
    setMessages([{ id: nextId.current++, role: 'user', text: coachPrompt, shown: coachPrompt.length }]);
    timers.current.push(setTimeout(() => coachReply(introText(quadrant)), reducedMotion ? 0 : 500));
  };

  useEffect(() => {
    startConversation(quadrantId);
    return clearTimers;
    // The conversation starts once when the panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [messages, reducedMotion]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    setMessages((m) => [...m, { id: nextId.current++, role: 'user', text, shown: text.length }]);
    const reply = coachFollowUps[followUpIndex.current % coachFollowUps.length];
    followUpIndex.current += 1;
    timers.current.push(setTimeout(() => coachReply(reply), reducedMotion ? 0 : 500));
  };

  return (
    <div className="flex h-full w-[256px] flex-col bg-[var(--color-white)] text-[var(--color-purple-800)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-1 px-4 pb-2 pt-4">
        <Heading tag="h3" variant="heading-5">
          Coach
        </Heading>
        <div className="flex items-center">
          <Button
            variant="tertiary"
            size="small"
            hasHiddenLabel
            className="heatmap-toolbar-button"
            icon={<Icon name="close" isPresentational />}
            onPress={onClose}
          >
            Close Coach
          </Button>
        </div>
      </div>

      {/* Conversation */}
      <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-4 py-3" aria-live="polite">
        {messages.map((message) =>
          message.role === 'user' ? (
            <motion.div
              key={message.id}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <p className="max-w-[85%] rounded-[10px] bg-[var(--color-gray-200)] px-3 py-2 text-[12px] leading-[1.4]">
                {message.text}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={message.id}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <Icon
                name="auto_awesome"
                isPresentational
                className="mt-2 shrink-0 !text-[16px] text-[var(--color-purple-800)]"
              />
              <div
                className="min-w-0 flex-1 rounded-[8px] border-2 border-transparent px-3 py-2 text-[12px] leading-[1.5]"
                style={{ background: COACH_BORDER }}
              >
                {message.loading ? (
                  <div className="space-y-2 py-1" aria-label="Coach is thinking">
                    <div className="h-2 w-3/4 animate-pulse rounded bg-[var(--color-gray-300)]" />
                    <div className="h-2 w-full animate-pulse rounded bg-[var(--color-gray-300)]" />
                  </div>
                ) : (
                  <p className="whitespace-pre-line">
                    <RichText text={message.text.slice(0, message.shown)} />
                  </p>
                )}
              </div>
            </motion.div>
          )
        )}
      </div>

      {/* Reply */}
      <form onSubmit={send} className="px-4 pb-4 pt-2">
        <label htmlFor="coach-reply" className="mb-1 block text-[11px] font-semibold">
          Reply to Coach
        </label>
        <div className="flex items-center gap-2 rounded-[7px] border-2 border-[var(--color-gray-500)] bg-[var(--color-white)] py-1 pl-3 pr-1">
          <input
            id="coach-reply"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[12px] outline-none"
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="primary"
            size="small"
            hasHiddenLabel
            icon={<Icon name="send" isPresentational />}
            isDisabled={!draft.trim()}
          >
            Send
          </Button>
        </div>
        <p className="mt-2 text-[10px] leading-[1.4] text-[var(--color-gray-600)]">
          Your conversations with Coach are private and not shared with anyone in your organization.
        </p>
      </form>
    </div>
  );
}
