var express = require('express');
const { route } = require('.');
var router = express.Router();

var mysql = require('mysql')

var db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'Q!w2E#r4T%y6U&i8O(p0',
  database: 'walletapp_db'
})

router.post('/topup', (req, res) => {

})

router.post('/topup', (req, res) => {

})

module.exports = router;