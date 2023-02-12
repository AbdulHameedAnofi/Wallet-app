const { PrismaClient } = require('@prisma/client');
const { json } = require('body-parser');

const db = new PrismaClient();

/* 
  Required input fields
  name
  email
  phone
  passcode
*/

module.exports = async (req, res) => {
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
      const createUser = await db.user.create({
        data: {
          'name': body.name,
          'email': body.email,
          'phone': body.phone,
          'passcode': body.passcode,
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
    // next();
}