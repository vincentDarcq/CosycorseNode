const router = require('express').Router();
const { STRIPE_SECRET_KEY } = require(`../tokens/${process.env.NODE_ENV}`)

exports.stripe = require('stripe')(STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: { // For sample support and debugging, not required for production:
        name: "stripe-samples/accept-a-payment/custom-payment-flow",
        version: "0.0.2",
        url: "https://github.com/stripe-samples"
    }
});

router.get('/config', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

module.exports = router;