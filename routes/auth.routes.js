const { login, register, logout } = require('../controllers/auth.contollers');

const router = require('express').Router();


router.post('/login', login);
router.post('/register', register)
router.get('/logout', logout)

module.exports = router;