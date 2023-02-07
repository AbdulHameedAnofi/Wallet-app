var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(session({
  secret: "1q2w3e4r5t6y7u8i9o0p",
  // cookie: {
  //   secure: true,
  //   httpOnly: true,
  //   maxAge: 3600000
  // },
  name: "sessionId",
  saveUninitialized: true,
  resave: true
}));

const db = new PrismaClient();

//create user account
router.post('/register', (req, res) => {
  var body = req.body;
  var wallet_id = Math.floor(Math.random() * (100000000 - 10) + 100000000);
  if (!body.name || !body.email || !body.phone || !body.passcode) {
    res.status(400).json({
      error: 'All fields are required'
    });
    console.log("Please fill all fields");
  }
  
  if (!body.passcode.length == 6 || isNaN(body.passcode)) {
    res.status(400).json({
      error: "passcode must be 6 numeric digits"
    });
  }

  // const email = async () => {
  //   const email_existence = await db.user.findFirst({
  //     where: {
  //       email: body.email
  //     }
  //   });
  // }
  // email();

  const createUser = async () => {
    const email_existence = await db.user.count({
      where: {
        email: body.email
      }
    });

    if (email_existence > 0) {
      res.status(400).json({
        error: "email address already exists"
      });
    } else {
      await db.user.create({
        data: {
          'name': body.name,
          'email': body.email,
          'phone': body.phone,
          'passcode': body.passcode,
          'user_type': body.user_type,
          'wallet': {
            create: {
              'id': wallet_id,
              'balance': 0
            }
          }
        }
      });
      res.status(201).json({
        status: 'account created successfuly'
      });
    }
  }
  createUser();
})

function login(email, passcode) {
  // const session = req.session;
  const auth = async () => {
    const account = await db.user.findFirst({
      where: {
        email: email,
        passcode: passcode
      }
    });

    if (!email || !passcode) {
      res.json({
        status: "Please Input name and passcode to continue"
      })
    }

    if (!account) {
      res.json({
        status: "Invalid username or passcode"
      })
    } else {
      session.user = account;
      session.wallet = await db.wallet.findFirst({
        where: {
          userId: account.id
        }
      });
      res.cookie("sessionId", session)
      res.send(req.sessionID);
      // res.redirect('/user/'+account.id);
      // res.json 
      return "welcome";  
    }

  };
  auth();
}

//authenticate thhe user
router.get('/login', (req, res) => {
})

// router.get('/user', (req, res) => {
//   var session = req.session;
//   if (session.user) {
//     res.send(session.user);
//   } else {
//     res.json({
//       status: "Welcome "+account.name
//     })
//   }
// })

/* GET home page. */
router.get('/or', function(req, res, next) {
  if (req.session.user) {
    res.json({stats: 'session trial'});
    // res.render('index', { title: 'Express' }); 
    console.log(req.session.user);
  } else {
    res.json({stats: 'omo mehn'});
    console.log(req.session.user);
  }
});

// module.exports = router;
exports.login = login;