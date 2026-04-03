import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITopic extends Document {
  title: string;
  description: string;
  category: string;
  subjectId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: 'General ICT' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema, 'topics');

export default Topic;
