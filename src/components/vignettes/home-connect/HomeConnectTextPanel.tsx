import { useCallback } from 'react';
import { homeConnectContent } from './content';
import DecisionStories, { DecisionStory } from '../shared/DecisionStories';

function ProjectName() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="size-1.5 rounded-full bg-neutral-400" />
      <span className="text-[13px] font-medium tracking-tight text-primary font-[family-name:var(--font-inter)]">
        {homeConnectContent.projectName}
      </span>
    </div>
  );
}

interface HomeConnectTextPanelProps {
  onActiveStoryChange?: (story: DecisionStory | null) => void;
  showBeforeState: boolean;
  onBeforeAfterToggle: (before: boolean) => void;
}

export default function HomeConnectTextPanel({
  onActiveStoryChange,
  showBeforeState,
  onBeforeAfterToggle,
}: HomeConnectTextPanelProps) {
  const renderStoryExtra = useCallback(
    (story: DecisionStory) => {
      if (story.id !== 'people-centric') return null;

      return (
        <div className="hidden lg:flex items-center gap-2 -mt-1 pb-4">
          <span className="text-caption text-primary/70">Compare</span>
          <div className="inline-flex rounded-full bg-black/5 p-0.5">
            <button
              onClick={() => onBeforeAfterToggle(true)}
              className={`px-3 py-1 rounded-full text-caption font-medium transition-all duration-200 cursor-pointer ${
                showBeforeState
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {story.toggleLabels?.[0] ?? 'Before'}
            </button>
            <button
              onClick={() => onBeforeAfterToggle(false)}
              className={`px-3 py-1 rounded-full text-caption font-medium transition-all duration-200 cursor-pointer ${
                !showBeforeState
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {story.toggleLabels?.[1] ?? 'After'}
            </button>
          </div>
        </div>
      );
    },
    [showBeforeState, onBeforeAfterToggle]
  );

  return (
    <div className="flex flex-col">
      <ProjectName />

      {/* Headline */}
      <h3 className="type-h2 text-primary">{homeConnectContent.headline}</h3>

      {/* Body */}
      <p className="type-body text-primary mt-5">{homeConnectContent.body}</p>

      {/* Decision stories */}
      <DecisionStories
        stories={homeConnectContent.decisionStories}
        onActiveStoryChange={onActiveStoryChange}
        renderStoryExtra={renderStoryExtra}
      />
    </div>
  );
}
