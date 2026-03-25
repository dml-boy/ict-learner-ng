import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  title: string;
  description: string;
  icon: string;
  color: string;
  allowedContexts: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: '📚' },
    color: { type: String, default: '#3b82f6' },
    allowedContexts: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
