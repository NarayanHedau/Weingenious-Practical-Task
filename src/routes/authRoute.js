const router = require('express').Router();
const auth = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validator/authValidator');
const validate = require('../middleware/validate');

router.post('/register', validate(registerSchema), auth.register);
router.post('/login', validate(loginSchema), auth.login);

module.exports = router

