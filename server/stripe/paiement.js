const router = require('express').Router();
const env = require(`../environment/${process.env.NODE_ENV}`);
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const fs = require('fs');
const RSA_PUBLIC_KEY = fs.readFileSync('./rsa/key.pub');

const {
  getUserFromToken
} = require(`../controllers/authentication`);

const { 
  STRIPE_SECRET_KEY, 
  STRIPE_CLIENT_ID,
  STRIPE_WEBHOOK_SECRET
} = require(`../tokens/${process.env.NODE_ENV}`);

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const {
  getUserById,
  findByIdAndUpdate
} = require(`../queries/user.queries`);

const {
  getLogementById
} = require(`../queries/logement.queries`);

let makeStripeConnectRequest = async (code) => {
  let params = {
    grant_type: 'authorization_code',
    client_id: STRIPE_CLIENT_ID,
    client_secret: STRIPE_SECRET_KEY,
    code: code,
  };

  let url = 'https://connect.stripe.com/oauth/token';

  logger.log('StripeSetup.makeStripeConnectRequest.params', params);

  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {'Content-Type': 'application/json'},
  })
    .then((res) => res.json())
    .catch((err) => {
      logger.log('StripeSetup.makeStripeConnectRequest.error', err);
    });
}

let updateUserAccount = (user, stripeUserId) => {
  user.stripeUserId = stripeUserId
  findByIdAndUpdate(user._id, user);
};

router.get('/setup', async (req, res) => {
  const user = await getUserById(req.query.userId);
  let redirect_uri = `${env.apiUrl}/stripe/redirect`;
  let stripeConnectParams = {
    response_type: 'code',
    redirect_uri: redirect_uri,
    client_id: STRIPE_CLIENT_ID,
    scope: 'read_write',
    'stripe_user[email]': user.email,
    'stripe_user[first_name]': user.firstName,
    'stripe_user[last_name]': user.lastName,
    'stripe_user[business_type]': 'individual',
    'stripe_user[country]': 'FR',
  };

  let reqQuery = querystring.stringify(stripeConnectParams);

  const location = `https://connect.stripe.com/express/oauth/authorize?${reqQuery}`;

  res.status(200).json({
    location: location,
  });
})

router.get('/response/setup', getUserFromToken, async (req, res) => {

  try {
    const code = req.query.code;

    // 1) Post the authorization code to Stripe to complete the Express onboarding flow
    let stripeConnectRequest = await makeStripeConnectRequest(code);

    console.log('stripeConnectRequest', stripeConnectRequest);
    // 2) Update User account with StripeUserId
    let stripeUserId = stripeConnectRequest.stripe_user_id;

    if (!stripeUserId) {
      console.log('StripeSetup.abort.no.stripeUserId');
      return res.status(400).json({msg: 'Connect request to Stripe failed'});
    }

    updateUserAccount(res.locals.user, stripeUserId);

    return res.status(200).json({status: 'ok'});
  } catch (err) {
    console.log('StripeSetup.error', err);
    return res.status(400).json(err);
  }
})

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
      nextAction: paymentIntent.next_action,
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