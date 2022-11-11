const router = require('express').Router();
const { 
    STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY,
    STRIPE_CLIENT_ID
} = require(`../tokens/${process.env.NODE_ENV}`);

const {
    getUserFromToken
} = require(`../controllers/authentication`);

const {
    getUserById,
    findByIdAndUpdate
} = require(`../queries/user.queries`);

const env = require(`../environment/${process.env.NODE_ENV}`);
const querystring = require('querystring');
const axios = require('axios');

const stripe = require('stripe')(STRIPE_SECRET_KEY);

let makeStripeConnectRequest = async (code) => {
    let params = {
      grant_type: 'authorization_code',
      client_id: STRIPE_CLIENT_ID,
      client_secret: STRIPE_SECRET_KEY,
      code: code,
    };
  
    let url = 'https://connect.stripe.com/oauth/token';
    
    return await axios.post(url, params);
}
  
let updateUserAccount = async (user, stripeUserId) => {
    user.stripeUserId = stripeUserId;
    const u = await findByIdAndUpdate(user._id, user);
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
        let stripeConnectRequest = await makeStripeConnectRequest(code);  
        let stripeUserId = stripeConnectRequest.data.stripe_user_id;  
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
});

router.get('/config', (req, res) => {
    res.send({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
    });
});

router.get('/link', async (req, res) => {
    let stripeReq = await stripe.accounts.createLoginLink(req.query.stripeUserId);
    return res.status(200).json(stripeReq);
})

module.exports = router;