const Paystack = require('paystack')(process.env.SECRET_KEY)

// const JWT_SECRET = "goK$%dygnj&&8%$4^8jjYrddrYij*&%44AsWUCLheBazl";

module.exports = async (req, res) => {
  Paystack.transaction.verify({
  }).then(function(body){
    res.json({trial: body});
  });
}