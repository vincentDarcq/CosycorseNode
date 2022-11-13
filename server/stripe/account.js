const { 
    STRIPE_SECRET_KEY
} = require(`../tokens/${process.env.NODE_ENV}`);
  
const stripe = require('stripe')(STRIPE_SECRET_KEY);

exports.deleteStripeAccount = async (stripeAccountId) => {
    return await stripe.accounts.del(stripeAccountId);
}