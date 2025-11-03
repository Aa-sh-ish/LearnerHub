const router = require('express').Router();
const authConteroller = require('../controllers/authcontroller')

router.post('/register',authConteroller.createUser)

router.post('/login',authConteroller.LoginUser)

module.exports = router;