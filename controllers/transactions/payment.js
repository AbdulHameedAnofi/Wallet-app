const { PrismaClient } = require("@prisma/client");
const { json } = require('body-parser');
const session = require('express-session');

const db = new PrismaClient();


/*required request body include 
    amount
    wallet_id  //recievers wallet_id
    description //description of transaction
*/
module.exports = async (req, res) => {
    var reference_id = Math.random().toString(36).slice(2);

    const senders_wallet = await db.wallet.findFirst({
        where: {
            id: session.wallet.wallet_id,
        }
    })

    const recievers_wallet = await db.wallet.findFirst({
        where: {
            id: req.body.wallet_id,
        }
    })

    if (!req.body.amount || !req.body.wallet_id || !req.body.description) {
        res.status(400).json({
            status: "Please input amount, description and recievers wallet id"
        })
    }

    if (!recievers_wallet) {
        res.json({
            status: "Invalid Wallet Id inputed"
        });
    }

    if (isNaN(req.body.amount)) {
      res.status(400).json({
        error: "amount must be a number"
      });
    }

    if (senders_wallet.balance  < req.body.amount) {
        res.json({
            status: "Insufficient funds"
        });
    }

    
    await db.$transaction([
        db.wallet.update({
          where: {
            id: session.wallet.id
          },
          data: {
            balance: session.wallet.balance - req.body.amount
          }
        }),
        db.wallet.update({
          where: {
            id: req.body.wallet_id
          },
          data: {
            balance: recievers_wallet.balance + req.body.amount
          }
        })
      ])
    // await db.wallet.update({
    //     where: {
    //         id: session.wallet.wallet_id
    //     },
    //     data: {
    //         balance: senders_wallet.balance - req.body.amount
    //     },
    //     where: {
    //         id: req.body.wallet_id
    //     },
    //     data: {
    //         balance: recievers_wallet.balance + req.body.amount
    //     }
    // })

    await db.transactions.create({
        data: {
            reference_id: reference_id,
            description: req.body.description,
            transaction_amount: req.body.amount,
            credited_wallet_id: req.body.wallet_id,
            debited_wallet_id: session.wallet.id
        }
    })
    res.status(200).json({
        status: "Payment has gone through succcessfuly"
    })
}