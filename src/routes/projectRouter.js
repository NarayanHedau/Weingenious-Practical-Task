const router = require('express').Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema } = require('../validator/projectValidator');

router.post('/', auth, role(['admin', 'manager']), validate(createProjectSchema), projectController.createProject);
router.get('/list', auth, role(['admin', 'manager', 'user']), projectController.getProjects);
router.get('/dd', auth, role(['admin', 'manager', 'user']), projectController.getProjectDropdown);
router.patch("/:id", auth, role(['admin', 'manager']), validate(updateProjectSchema), projectController.updateProject);
router.delete("/:id", auth, role(['admin', 'manager']), projectController.deleteProject);

module.exports = router