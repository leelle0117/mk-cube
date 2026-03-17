export interface Algorithm {
  name: string;
  algorithm: string;
  moveCount: number;
  description?: string;
  tips?: string[];
  fingerTrick?: boolean;
  probability?: string;
  facePattern?: string[];
  patternLabel?: string;
  category?: string;
}

export interface Step {
  title: string;
  description: string;
  algorithms: Algorithm[];
  tips?: string[];
  image?: string;
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  targetTime: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  color: string;
  steps: Step[];
}
