import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  icon: String,
  content: {
    type: String,
    required: true,
  },
  sections: [{
    id: String,
    title: String,
    content: String,
    subsections: [{
      id: String,
      title: String,
      content: String,
    }]
  }],
  exercises: [{
    id: Number,
    title: String,
    question: String,
    solution: String,
    type: {
      type: String,
      enum: ['practice', 'quiz'],
      default: 'practice'
    }
  }],
  order: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);