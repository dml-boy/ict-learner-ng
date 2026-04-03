import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IModule extends Document {
  title: string;
  content: string;
  topicId: Types.ObjectId;
  type: 'lesson' | 'activity' | 'project';
  // 5E Framework
  engage: string;
  explore: string;
  explain: string;
  elaborate: Map<string, string>; // Contextual adaptation
  evaluate: string;
  constructivistNote: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  nextModuleId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    type: { type: String, enum: ['lesson', 'activity', 'project'], default: 'lesson' },
    // 5E Framework
    engage: { type: String, default: '' },
    explore: { type: String, default: '' },
    explain: { type: String, default: '' },
    elaborate: { type: Map, of: String, default: {} },
    evaluate: { type: String, default: '' },
    constructivistNote: { type: String, default: '' },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true }, // Index of the correct option
        explanation: { type: String, required: true }, // Scaffolding: why this is correct
      },
    ],
    nextModuleId: { type: Schema.Types.ObjectId, ref: 'Module' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Module: Model<IModule> = mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema, 'modules');

export default Module;
