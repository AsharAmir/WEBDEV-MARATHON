const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Export both the Stripe instance and the public key
module.exports = {
  stripe,
  publicKey: process.env.STRIPE_PUBLIC_KEY
}; 