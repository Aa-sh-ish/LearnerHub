const router = require('express').Router();

const authConteroller = require('../controllers/authcontroller')
const getAdminRequests = require('../controllers/SuperAdminControllers/superAdminrequestControllers');
const verifyToken = require('../Middleware/verifyToken');

router.post('/register',authConteroller.createUser)

router.post('/login',authConteroller.LoginUser)

router.get('/admin-requests', verifyToken, getAdminRequests.getAdminRequests);

module.exports = router;