const mongoose = require('mongoose');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const { PRIORITIES, STATUSES } = require('../utils/constants');
const { validateTask, escapeRegex } = require('../utils/validators');

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

const invalidId = (res) => res.status(400).json({ success: false, message: 'Invalid task ID.' });
const notFoundTask = (res) => res.status(404).json({ success: false, message: 'Task not found.' });

/** Summary numbers calculated from ALL of this user's tasks in MongoDB. */
async function getStats(userId) {
  const [byStatus, overdue] = await Promise.all([
    Task.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(String(userId)) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.countDocuments({ userId, status: { $ne: 'Completed' }, dueDate: { $lt: startOfToday() } }),
  ]);

  const counts = Object.fromEntries(byStatus.map((r) => [r._id, r.count]));
  const pending = counts['Pending'] || 0;
  const inProgress = counts['In Progress'] || 0;
  const completed = counts['Completed'] || 0;
  return { total: pending + inProgress + completed, pending, inProgress, completed, overdue };
}

// Due dates are stored at midnight UTC, so compare against today's calendar date at midnight UTC.
function startOfToday() {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
}

// GET /api/tasks?search=&status=&priority=&sort=
exports.getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, sort = 'newest' } = req.query;

  // ownership is part of every query: userId = the logged-in user
  const filter = { userId: req.user._id };

  if (typeof search === 'string' && search.trim()) {
    filter.title = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: 'i' };
  }
  if (typeof status === 'string' && status) {
    if (!STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status filter.' });
    filter.status = status;
  }
  if (typeof priority === 'string' && priority) {
    if (!PRIORITIES.includes(priority)) return res.status(400).json({ success: false, message: 'Invalid priority filter.' });
    filter.priority = priority;
  }

  const [docs, stats] = await Promise.all([Task.find(filter).sort({ createdAt: -1 }), getStats(req.user._id)]);

  let tasks = docs;
  if (sort === 'due') {
    // soonest first; tasks without a due date go last
    tasks = [...docs].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate - b.dueDate;
    });
  } else if (sort === 'priority') {
    tasks = [...docs].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  }

  res.json({ success: true, tasks, stats });
});

// POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
  const { errors, value } = validateTask(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
  }
  const task = await Task.create({ ...value, userId: req.user._id });
  res.status(201).json({ success: true, message: 'Task created.', task });
});

// GET /api/tasks/:id
exports.getTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) return notFoundTask(res);
  res.json({ success: true, task });
});

// PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const { errors, value } = validateTask(req.body, { partial: true });
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
  }
  if (Object.keys(value).length === 0) {
    return res.status(400).json({ success: false, message: 'Nothing to update.' });
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id }, // someone else's task simply is not found
    { $set: value },
    { new: true, runValidators: true }
  );
  if (!task) return notFoundTask(res);
  res.json({ success: true, message: 'Task updated.', task });
});

// DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) return notFoundTask(res);
  res.json({ success: true, message: 'Task deleted.' });
});
