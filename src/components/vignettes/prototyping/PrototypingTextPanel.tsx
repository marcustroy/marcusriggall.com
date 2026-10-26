import { prototypingContent } from './content';
import DecisionStories from '../shared/DecisionStories';

export default function PrototypingTextPanel() {
  return (
    <div className="flex flex-col">
      {/* Headline */}
      <h3 className="type-h2 text-primary">{prototypingContent.headline}</h3>

      {/* Body */}
      <p className="type-body text-primary mt-5">{prototypingContent.body}</p>

      {/* Decision stories */}
      <DecisionStories
        stories={prototypingContent.decisionStories}
        alwaysExpanded
      />
    </div>
  );
}
