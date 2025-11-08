const router = require('express').Router();

const getAdminRequests = require('../controllers/SuperAdminControllers/superAdminrequestControllers');
const verifyToken = require('../Middleware/verifyToken');

router.patch('/approve-admin-request/:id',verifyToken, getAdminRequests.approveAdminRequest);

module.exports = router;