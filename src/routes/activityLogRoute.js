const router = require('express').Router();
const activityLogController = require('../controllers/activityLogController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/list', auth, role(['admin']), activityLogController.getActivityLogs);

module.exports = router;
