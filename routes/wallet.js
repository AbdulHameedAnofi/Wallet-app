var express = require('express');
var router = express.Router();
var topUp = require('../controllers/transactions/topUp');
var topUpCallback = require('../controllers/transactions/topUpCalback');
var payment = require('../controllers/transactions/payment');
var transactions = require('../controllers/transactions/transactions');
var login = require('../controllers/auth/login');

//top up wallet
router.post('/topUp', login, topUp)

router.get('/topUpCallback', topUpCallback)

router.post('/transaction/payment', login, payment)

router.get('/transaction/records', login, transactions)

module.exports = router;