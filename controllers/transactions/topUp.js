const { json } = require('body-parser');
const Paystack = require('paystack')(process.env.PUBLIC_KEY);
const session = require('express-session');

// const JWT_SECRET = "goK$%dygnj&&8%$4^8jjYrddrYij*&%44AsWUCLheBazl";

/*
  This accept amount for users account topup
*/
module.exports = async (req, res) => {
  var reference_id = Math.random().toString(36).slice(2);
  Paystack.transaction.initialize({
    email: session.user.email,
    amount: req.body.amount * 100, // in kobo
    reference: reference_id
  }).then(function(body){
    res.json({trial: body});
  });
}
//   function payWithPaystack() {
//   var handler = PaystackPop.setup({
//     key: process.env.PUBLIC_KEY, // Replace with your public key
//     email: session.user.email,
//     amount: req.body.amount * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
//     currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars
//     ref: reference_id, // Replace with a reference you generated
//     callback: function(response) {
//       //this happens after the payment is completed successfully
//       var reference = response.reference;
//       alert('Payment complete! Reference: ' + reference);
//       // Make an AJAX call to your server with the reference to verify the transaction
//     }
//   })
// }