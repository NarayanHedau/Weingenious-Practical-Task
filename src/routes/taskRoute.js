const router = require('express').Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const { createTaskSchema, updateSubTaskSchema, createSubtaskSchema } = require('../validator/taskValidator');

router.post('/', auth, role(['admin', 'user', 'manager']), validate(createTaskSchema), taskController.createTask);
router.post('/create-subtask', auth, role(['admin', 'user', 'manager']), validate(createSubtaskSchema), taskController.createSubtask);
router.patch('/update-subtask/:id', auth, role(['admin', 'user', 'manager']), validate(updateSubTaskSchema), taskController.updateSubtask);
router.get('/:projectId', auth, role(['admin', 'user', 'manager']), taskController.getTaskList);
router.delete('/:id', auth, role(['admin','manager']), taskController.deleteTask);
module.exports = router