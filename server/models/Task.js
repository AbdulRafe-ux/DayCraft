const mongoose = require('mongoose');
const { CATEGORIES, PRIORITIES, STATUSES } = require('../utils/constants');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    category: { type: String, enum: CATEGORIES, default: 'General' },
    priority: { type: String, enum: PRIORITIES, default: 'Medium' },
    status: { type: String, enum: STATUSES, default: 'Pending' },
    dueDate: { type: Date, default: null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Speeds up "my tasks, filtered by status, newest first"
taskSchema.index({ userId: 1, status: 1, createdAt: -1 });

taskSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id.toString(),
    title: ret.title,
    description: ret.description,
    category: ret.category,
    priority: ret.priority,
    status: ret.status,
    dueDate: ret.dueDate,
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});

module.exports = mongoose.model('Task', taskSchema);
