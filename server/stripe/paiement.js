const router = require('express').Router();

const { 
  STRIPE_SECRET_KEY, 
  STRIPE_WEBHOOK_SECRET
} = require(`../tokens/${process.env.NODE_ENV}`);

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const {
  getLogementById
} = require(`../queries/logement.queries`);

router.get('/create-payment-intent', async (req, res) => {
  const logementId = req.query.logementId;
  const nuits = req.query.nuits;
  const paymentMethodId = req.query.paymentMethodId;

  const logement = await getLogementById(logementId);
  const amount = nuits * (logement.prix + logement.prix * 10/100) * 100;

  const params = {
    payment_method: paymentMethodId,
    payment_method_types: ['card'],
    amount: amount,
    currency: 'eur',
    transfer_group: `adresse : ${logement.adresse}, customer : ${req.query.customerId}`
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

router.post('/webhook', async (req, res) => {
  console.log("webhook")
  let data, eventType;

  // Check if webhook signing is configured.
  if (STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
    console.log(eventType);
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === 'payment_intent.succeeded') {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log('💰 Payment captured!');
  } else if (eventType === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed.');
  }
  res.sendStatus(200);
});

module.exports = router;