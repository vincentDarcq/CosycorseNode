const RemboursementStripe = require('../models/remboursement_stripe.model');

let createRemboursement = (remboursement) => {
    return remboursement.save();
}

let getRemboursementByPaiementIntent = (pi) => {
    return RemboursementStripe.find({ payment_intent: pi }).exec();
}

module.exports = {
    createRemboursement,
    getRemboursementByPaiementIntent
}