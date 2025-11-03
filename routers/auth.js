const router = require('express').Router();
const authConteroller = require('../authcontroller')

router.post('/register',authConteroller.createUser)

router.post('/login',authConteroller.LoginUser)

module.exports = router;