export interface Subject {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  allowedContexts: string[];
}

export interface Topic {
  _id: string;
  title: string;
  description: string;
  category: string;
  subjectId: string | Subject;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AiGeneratedData {
  engage: string;
  explore: string;
  explain: string;
  elaborate: Record<string, string>;
  evaluate: string;
  constructivistNote: string;
  questions: Question[];
}

export interface Module {
  _id: string;
  title: string;
  content: string;
  topicId: string | Topic;
  type: 'lesson' | 'activity' | 'project';
  engage: string;
  explore: string;
  explain: string;
  elaborate: Record<string, string>;
  evaluate: string;
  constructivistNote: string;
  questions: Question[];
  createdBy?: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  _id: string;
  userId: string;
  moduleId: string | Module;
  status: 'available' | 'in-progress' | 'completed';
  lastAccessed: string;
}

