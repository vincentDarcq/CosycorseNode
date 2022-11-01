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
  STRIPE_CLIENT_ID 
} = require(`../tokens/${process.env.NODE_ENV}`);

const {
  getUserById,
  findByIdAndUpdate
} = require(`../queries/user.queries`);

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

router.post('/create-payment-intent', async (req, res) => {
    const {paymentMethodType, currency,paymentMethodOptions} = req.body;
  
    // Each payment method type has support for different currencies. In order to
    // support many payment method types and several currencies, this server
    // endpoint accepts both the payment method type and the currency as
    // parameters.
    //
    // Some example payment method types include `card`, `ideal`, and `alipay`.
    const params = {
      payment_method_types: ['card'],
      amount: 5999,
      currency: 'eur',
    }
  
    // If this is for an ACSS payment, we add payment_method_options to create
    // the Mandate.
    if(paymentMethodType === 'acss_debit') {
      params.payment_method_options = {
        acss_debit: {
          mandate_options: {
            payment_schedule: 'sporadic',
            transaction_type: 'personal',
          },
        },
      }
    } else if (paymentMethodType === 'konbini') {
      /**
       * Default value of the payment_method_options
       */
      params.payment_method_options = {
        konbini: {
          product_description: 'Tシャツ',
          expires_after_days: 3,
        },
      }
    } else if (paymentMethodType === 'customer_balance') {
      params.payment_method_data = {
        type: 'customer_balance',
      }
      params.confirm = true
      params.customer = req.body.customerId || await stripe.customers.create().then(data => data.id)
    }
  
    /**
     * If API given this data, we can overwride it
     */
    if (paymentMethodOptions) {
      params.payment_method_options = paymentMethodOptions
    }
  
    // Create a PaymentIntent with the amount, currency, and a payment method type.
    //
    // See the documentation [0] for the full list of supported parameters.
    //
    // [0] https://stripe.com/docs/api/payment_intents/create
    try {
      const paymentIntent = await stripe.paymentIntents.create(params);
  
      // Send publishable key and PaymentIntent details to client
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

module.exports = router;