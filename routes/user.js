var express = require('express');
const { route } = require('.');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const session = require('express-session');
const Paystack = require('paystack')(process.env.SECRET_KEY)

const db = new PrismaClient;

//to get all the users details
router.get('/', (req, res) => {
  var session = req.session;
  const userDetials = async () => {
    // res.send(await db.user.findFirst({
    //   where: {
    //     id: session.user.id
    //   },
    //   include: {
    //     wallet: true
    //   }
    // })
    // )
  };
  userDetials();
  if (session) {
    res.json({
      session: session
    });
  } else {
    res.json({
      omo: 'Omo mehn'
    })
  }
})

//to top up user wallet
router.post('/wallet-top-up', (req, res) => {
  Paystack.transaction.initialize({
    email: 'customer@email.com',
    amount: 10000, // in kobo
    reference: 64738838
  }).then(function(body){
    res.json({trial: body});
  });
})


router.get('/wallet-top-up/callback', (req, res) => {
  Paystack.transaction.verify({
    reference: 234567
  }).then(function(body){

    res.json({trial: body});
  });
})

//route to make payment
router.post('/payment', (req, res) => {
  var session = req.session;
  var body = req.body;
  console.log(res.session);
  var reference_id = Math.random().toString(36).slice(2);
  if (!body.amount || !body.pay_to_walletId || !body.description) {
    res.status(400).json({
      error: "All fields are required"
    })
  }
  if (isNaN(body.amount)) {
    res.status(400).json({
      error: "amount must be a number"
    });
  }

  /*
    Payment function
  */
  const pay = async (amount, walletId, description) => {

    var wallet_to = await db.wallet.findFirst({
      where: {
        id: walletId
      }
    });

    if (!wallet_to) {
      res.status(400).json({
        status: 'the Wallet Id provided does not exist'
      })
    }

    if (amount < session.wallet.balance) {
      res.status(400).json({
        status: 'Insufficient funds'
      })
    }

    res.redirect('/auth');

    /*
    
    updating balance on wallets

    */
    // await db.wallet.update({
    //   where: {
    //     id: session.wallet.id
    //   },
    //   data: {
    //     balance: session.wallet.balance - amount
    //   },
    //   where: {
    //     id: pay_to_walletId
    //   },
    //   data: {
    //     balance: wallet_to.balance + amount
    //   }
    // })
    await db.$transaction([
      await db.wallet.update({
        where: {
          id: session.wallet.id
        },
        data: {
          balance: session.wallet.balance - amount
        }
      }),
      await db.wallet.update({
        where: {
          id: pay_to_walletId
        },
        data: {
          balance: wallet_to.balance + amount
        }
      })
    ])

    //creating transaction record
    await db.transactions.create({
      reference_id: reference_id,
      description: description,
      amount: amount,
      credited_wallet_id: pay_to_walletId,
      debited_wallet_id: session.wallet.id,
    })
  };
  pay(body.amount, body.walletId, body.description)
})

/*

authenticating user for transaction

*/
router.get('/auth', (req, res) => {
  var session = req.session
  const authenticate = async (passcode) => {
    const pass = await db.user.findFirst({
      where: {
        id: session.id
      }
    });
    if (!pass.passcode == passcode) {
      res.json({
        status: "Invalid passcode provided"
      })
    }
    res.redirect('back');
  }
  authenticate(res.body)
})

//getting all transactions of a user
router.get('/transactions', (req, res) => {
  var session = req.session;
  const transaction_details = async () => {
    const transactions = await db.transactions.findMany({
      where: {
        OR: [
            {
            credited_wallet_id: session.wallet.id
          },
          {
            debited_wallet_id: session.wallet.id
          }
        ]
      }
    });
    res.send(transactions);
  }
  transaction_details();
});


module.exports = router;