const router = require('express').Router();
const authConteroller = require('../controllers/authcontroller')
const verifyToken = require('../Middleware/verifyToken');
const getAdminRequests = require('../controllers/SuperAdminControllers/superAdminrequestControllers');

router.post('/register',authConteroller.createUser)

router.post('/login',authConteroller.LoginUser)

router.get('/admin-requests', verifyToken.verifyToken, getAdminRequests.getAdminRequests);

module.exports = router;