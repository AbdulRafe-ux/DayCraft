const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getTasks, createTask, getTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.use(requireAuth); // every task route needs a logged-in user

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
