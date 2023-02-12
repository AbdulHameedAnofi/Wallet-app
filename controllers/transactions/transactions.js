const { PrismaClient } = require("@prisma/client");
const session = require('express-session');

const db = new PrismaClient();

module.exports = async(req, res) => {
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
    res.status(200).json({
        my_transactions: transactions
    })
  }