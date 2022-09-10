var express = require('express')
var router = express.Router()
var user = require('../controller/user_ctr')
var middileware = require('../middileware/index')

router.post('/userRegistration', user.userRegistration);

router.post('/userLogin', user.userLogin);
router.post('/uplodeImages',middileware.checkAuthentication,user.uplodeImages)

module.exports = router;