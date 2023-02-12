# Wallet-app


## Installation

Clone this repo.

Run the following commands:

* npm install
* npx prisma migrate dev --name init

## Routes

* Register (root, post, '/register')
  registers a new user and creates a wallet account simultaneously
  params[name, email, phone, passcode(6 digits)
 
* Login (root, get, '/login)
  logs a registered user in and diaplays the users information
  params[email, passcode]

* Wallet topup (root, post, '/wallet/topUp')
  tops up a users account with paystack
  params[email, passcode, amount]
  
* Making payment (root, post, '/wallet/transaction/payment')
  makes payment to an existing wallet account
  params[email, passcode, amount, wallet_id (recievers wallet id), description]
  
* Transaction history (root, get, '/wallet/transaction/records')
  returns all the transaction records for a user
  

## Issues

For technical questions and bugs feel free to open one issue.
