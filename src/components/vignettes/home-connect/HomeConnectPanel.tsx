'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import type { DecisionStory } from '../shared/DecisionStories';

interface HomeConnectPanelProps {
  activeStory?: DecisionStory | null;
  showBeforeState?: boolean;
}

// Avatar component with initials
function Avatar({ initials, size = 20 }: { initials: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#FFF0E8] flex items-center justify-center shrink-0 text-[#2F2438]"
      style={{ width: size, height: size }}
    >
      <span className="font-semibold" style={{ fontSize: size * 0.4 }}>{initials}</span>
    </div>
  );
}

// Grouped avatars component for overlapping avatar display
function GroupedAvatars({ avatars }: { avatars: Array<{ initials: string }> }) {
  return (
    <div className="flex items-center pl-0 pr-[10px]">
      {avatars.map((avatar, index) => (
        <div key={index} className="shrink-0" style={{ marginRight: -10 }}>
          <Avatar initials={avatar.initials} size={20} />
        </div>
      ))}
    </div>
  );
}

// Status tag component
function StatusTag({ label, variant = 'success' }: { label: string; variant?: 'success' }) {
  const bgColor = variant === 'success' ? 'bg-emerald-500/20' : 'bg-black/5';
  return (
    <div className={`${bgColor} px-[9px] py-[3px] rounded-[15px]`}>
      <span className="text-xs text-primary leading-[18px]">{label}</span>
    </div>
  );
}

// Progress ring component
function ProgressRing({ progress, size = 24 }: { progress: number; size?: number }) {
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#44A289"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

// Goal donut component
function GoalDonut({ percentage }: { percentage: number }) {
  const strokeWidth = 4;
  const size = 48;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FFB600"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-label font-semibold text-primary/70">{percentage}%</span>
      </div>
    </div>
  );
}

// Divider with label
function FeedDivider({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <div className="flex items-center gap-4 py-1.5" style={style}>
      <span className="text-base font-semibold text-primary/70 shrink-0 leading-6">{label}</span>
      <div className="flex-1 h-px bg-[#524E56]/10 rounded-full" />
    </div>
  );
}

// Arrow icon
function ArrowIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="shrink-0">
      <path d="M3 1L7 5L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Down arrow icon for alerts
function DownArrowIcon() {
  return (
    <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
        <path d="M5 2V8M5 8L2 5M5 8L8 5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Feed card wrapper
interface FeedCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function FeedCard({ children, style }: FeedCardProps) {
  return (
    <div
      className="bg-background-elevated rounded-[7px] shadow-md p-5 flex items-center gap-4 overflow-clip"
      style={style}
    >
      <div className="flex-1 min-w-0">{children}</div>
      <ArrowIcon />
    </div>
  );
}

// Simple icon components for the before-state dashboard cards
function BarChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#5F3361]">
      <rect x="2" y="10" width="4" height="8" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="8" y="6" width="4" height="12" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="14" y="2" width="4" height="16" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#5F3361]">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#5F3361]">
      <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H8l-3 3v-3H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#5F3361]">
      <rect x="4" y="3" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M7 3V2a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="7" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="7" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

// Dashboard card for before state
function DashboardCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background-elevated rounded-[7px] shadow-md p-4 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold text-primary">{title}</span>
      </div>
      <span className="text-xs text-primary/50">{description}</span>
    </div>
  );
}

// Before state: dashboard-style layout with feature-category cards
function BeforeStateContent() {
  return (
    <div className="px-6 pt-4 pb-6">
      <div className="grid grid-cols-2 gap-2.5">
        <DashboardCard
          icon={<BarChartIcon />}
          title="Performance"
          description="View cycles and reviews"
        />
        <DashboardCard
          icon={<TargetIcon />}
          title="Goals"
          description="Track team goals"
        />
        <DashboardCard
          icon={<ChatIcon />}
          title="1-on-1s"
          description="Schedule and prepare"
        />
        <DashboardCard
          icon={<ClipboardIcon />}
          title="Surveys"
          description="View survey results"
        />
      </div>
    </div>
  );
}

// Dimming style helper
function getDimStyle(isDimmed: boolean): React.CSSProperties {
  return {
    opacity: isDimmed ? 0.4 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };
}

// After/normal state: the people-centric feed
function FeedContent({
  highlightOneOnOne,
}: {
  highlightOneOnOne?: boolean;
}) {
  const dimOther = highlightOneOnOne === true;

  return (
    <div className="px-6 pt-4 pb-6">
      <motion.div
        className="space-y-2.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <FeedDivider label="Upcoming" style={getDimStyle(dimOther)} />

        {/* Performance Cycle Card */}
        <div style={getDimStyle(dimOther)}>
          <FeedCard>
            <div className="space-y-3">
              <p className="text-base text-primary leading-6">
                <span className="font-semibold">2023 Performance Cycle</span> feedback closes in 3 days
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <ProgressRing progress={40} size={20} />
                  <span className="text-xl font-bold text-primary leading-6">2 of 5</span>
                </div>
                <p className="text-sm text-primary/70 leading-5">Direct reports with completed nominations</p>
                <div className="flex items-center gap-1">
                  <GroupedAvatars avatars={[
                    { initials: 'MW' },
                    { initials: 'MN' },
                    { initials: 'AP' },
                    { initials: 'JR' },
                  ]} />
                  <span className="text-sm text-primary leading-5">Malik Williams, Maya Nguyen and 3 others have not submitted their nominations</span>
                </div>
              </div>
            </div>
          </FeedCard>
        </div>

        {/* 1-on-1 Card — highlighted when story 2 is active */}
        <div style={getDimStyle(false)}>
          <FeedCard>
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Avatar initials="AP" size={18} />
                <span className="text-base font-semibold text-primary leading-6">Aisha Patel</span>
                <span className="text-base text-primary leading-6">1-on-1 today</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-primary/70 leading-[18px]">To discuss</p>
                <div className="flex items-center gap-1.5">
                  <DownArrowIcon />
                  <span className="text-sm font-semibold text-red-400 leading-5">Wellbeing has gone down since the last 1-on-1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Avatar initials="AP" size={18} />
                  <span className="text-sm text-primary leading-5">No topics from Aisha</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Avatar initials="CJ" size={18} />
                  <span className="text-sm text-primary leading-5">1 topic from you</span>
                </div>
              </div>
            </div>
          </FeedCard>
        </div>

        <FeedDivider label="Recent" style={getDimStyle(dimOther)} />

        {/* Goal Card */}
        <div style={getDimStyle(dimOther)}>
          <FeedCard>
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Avatar initials="MW" size={18} />
                <span className="text-base font-semibold text-primary leading-6">Malik John Williams</span>
                <span className="text-base text-primary leading-6">has an inactive goal</span>
              </div>
              <div className="flex items-center gap-2">
                <GoalDonut percentage={25} />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-sm font-semibold text-primary leading-5">Learn how to handle multiple priorities</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <StatusTag label="On track" variant="success" />
                    <span className="text-xs text-[#CDCDD0] leading-[18px]">&bull;</span>
                    <span className="text-xs text-primary/70 leading-[18px]">Updated just now</span>
                    <span className="text-xs text-[#CDCDD0] leading-[18px]">&bull;</span>
                    <span className="text-xs text-primary/70 leading-[18px]">Due Dec 31, 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </FeedCard>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomeConnectPanel({
  activeStory = null,
  showBeforeState = true,
}: HomeConnectPanelProps) {
  const isBeforeStory = activeStory?.id === 'people-centric';
  const isExperimentStory = activeStory?.id === 'experiment';

  // Determine what to render below the header
  const showDashboard = isBeforeStory && showBeforeState;

  return (
    <div className="w-full bg-background-subtle rounded-2xl overflow-visible">
      {/* Purple header */}
      <div className="bg-[#5F3361] px-6 pt-4 pb-4 relative rounded-t-2xl">
        {/* Culture Amp Logo */}
        <div className="flex items-center gap-1.5 mb-4">
          <img
            src="/logos/cultureamp.svg"
            alt="Culture Amp"
            className="h-4 brightness-0 invert"
          />
        </div>

        {/* Home title */}
        <motion.h1
          className="text-white text-h3 font-bold leading-tight !m-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Home
        </motion.h1>
      </div>

      {/* Content: before-state dashboard or people-centric feed */}
      <AnimatePresence mode="wait">
        {showDashboard ? (
          <motion.div
            key="before"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BeforeStateContent />
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FeedContent highlightOneOnOne={isExperimentStory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
