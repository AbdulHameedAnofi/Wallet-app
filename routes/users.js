var express = require('express');
const { route } = require('.');
var router = express.Router();

var mysql = require('mysql')

var db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'walletapp_db'
})

router.post('/', (req, res) => {
  var body = req.body;

  function createUser(name, email, phone, password) {
    if (!name && !email && !phone && !password) {
      res.send("Please fill all fields");
      console.log("Please fill all fields");
    }

    if (password.lenght !== 6) {
      res.send("passcode must be 6 digits")
    }
    else {
      db.query("INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)", [name, email, phone, password],
      (err, result) => {
        if (err) {
          console.log(err);
        }
    
        console.log(req.body.Name)
        res.send(req.body)
      })

    }

  }

  createUser(body.name, body.email, body.phone, body.password);

})

module.exports = router;