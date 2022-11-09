const RemboursementStripe = require('../models/remboursement_stripe.model');

exports.createRemboursement = (remboursement) => {
    return remboursement.save();
}

exports.getRemboursementByPaiementIntent = (pi) => {
    return RemboursementStripe.find({ payment_intent: pi }).exec();
}