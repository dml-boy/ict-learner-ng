import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string; // Using string for now, could be ObjectId if we had a User model
  moduleId: Types.ObjectId;
  status: 'locked' | 'in-progress' | 'completed';
  score: number;
  selectedContext: string;
  currentStep: number; // 0: Engage, 1: Explore, 2: Explain, 3: Elaborate, 4: Evaluate
  engageAnswer?: string;
  reflection?: string;
  completedAt?: Date;
  personalizedContent?: {
    engage: string;
    explore: string;
    explain: string;
    elaborate: string;
    evaluate: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    status: {
      type: String,
      enum: ['locked', 'in-progress', 'completed'],
      default: 'locked',
    },
    score: { type: Number, default: 0 },
    selectedContext: { type: String, default: '' },
    currentStep: { type: Number, default: 0 },
    engageAnswer: { type: String, default: '' },
    reflection: { type: String, default: '' },
    completedAt: { type: Date },
    personalizedContent: {
      engage: { type: String },
      explore: { type: String },
      explain: { type: String },
      elaborate: { type: String },
      evaluate: { type: String },
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique progress entry per user per module
UserProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

const UserProgress: Model<IUserProgress> =
  mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;
