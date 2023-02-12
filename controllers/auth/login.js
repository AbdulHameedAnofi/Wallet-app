const { PrismaClient } = require('@prisma/client');
const { json } = require('body-parser');
const session = require('express-session');

// const JWT_SECRET = "goK$%dygnj&&8%$4^8jjYrddrYij*&%44AsWUCLheBazl";
const db = new PrismaClient();

/*
  required fields
  email
  passcode //integer value
*/

module.exports = async(req, res, next) => {
  const account = await db.user.findFirst({
    where: {
      email: req.body.email,
      passcode: req.body.passcode
    }
  });

  if (!req.body.email || !req.body.passcode) {
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
  }
  next();
}