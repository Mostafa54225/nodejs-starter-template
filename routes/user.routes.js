const { getUsers, getUser, dashboard } = require('../controllers/user.controllers');
const { verifyUser } = require('../middleware/verifyToken');

const router = require('express').Router();


router.route('/').get(getUsers)
router.route('/:username').get(getUser)



router.route('/dashboard/:id').get(verifyUser, dashboard) // verifyUser is a middleware should pass to get the dashboard data


module.exports = router;