var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var register = require('../controllers/auth/register')
var login = require('../controllers/auth/login')
const session = require('express-session');

//create user account
router.post('/register', register)

router.get('/login', login, async(req, res) => {
  res.json({
    user: session.user,
    wallet: session.wallet
  })
})

module.exports = router;