export interface DesignIteration {
  id: string;
  label: string;
  annotation: string;
  imageUrl?: string;
}

export interface DesignNote {
  id: string;
  detail: string;
  x?: string; // e.g., '85%' - percentage from left of container
  y?: string; // e.g., '20%' - percentage from top of container
  popoverSide?: 'top' | 'bottom' | 'left' | 'right'; // Which side popover appears
}

export interface StageContent {
  title?: string;
  description?: string;
  cta?: string;
}

export interface VignetteStages {
  solution: StageContent;
  designNotes?: StageContent;
}
