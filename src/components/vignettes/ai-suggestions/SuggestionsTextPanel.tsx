import { aiSuggestionsContent } from './content';
import DecisionStories, {
  DecisionStory,
} from '../shared/DecisionStories';

function ProjectName() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="size-1.5 rounded-full bg-neutral-400" />
      <span className="text-[13px] font-medium tracking-tight text-primary font-[family-name:var(--font-inter)]">
        {aiSuggestionsContent.projectName}
      </span>
    </div>
  );
}

interface SuggestionsTextPanelProps {
  onActiveStoryChange?: (story: DecisionStory | null) => void;
}

export default function SuggestionsTextPanel({
  onActiveStoryChange,
}: SuggestionsTextPanelProps) {
  return (
    <div className="flex flex-col">
      <ProjectName />

      {/* Headline */}
      <h3 className="type-h2 text-primary">{aiSuggestionsContent.headline}</h3>

      {/* Body */}
      <p className="type-body text-primary mt-5">{aiSuggestionsContent.body}</p>

      {/* Decision stories */}
      <DecisionStories
        stories={aiSuggestionsContent.decisionStories}
        onActiveStoryChange={onActiveStoryChange}
      />
    </div>
  );
}
