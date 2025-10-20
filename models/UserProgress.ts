import mongoose from 'mongoose';

export interface IUserProgress {
  _id?: string;
  userId: string;
  lessonId: number;
  completed: boolean;
  completedAt?: Date;
  timeSpent?: number; // in minutes
  createdAt?: Date;
  updatedAt?: Date;
}

const UserProgressSchema = new mongoose.Schema<IUserProgress>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    lessonId: {
      type: Number,
      required: [true, 'Lesson ID is required'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
UserProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Avoid re-compilation in development
const UserProgress = mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;