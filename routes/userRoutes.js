const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/userController');
const userValidation = require('../middlewares/validations/userValidation');
const { tokenCheck } = require('../middlewares/auth');

router.post('/register', userValidation.register, register);
router.post('/login', userValidation.login, login);
router.get('/me', tokenCheck, me);
module.exports = router;