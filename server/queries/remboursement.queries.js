const RemboursementStripe = require('../models/remboursement_stripe.model');

let createRemboursement = (refund) => {
    return new RemboursementStripe({
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        metadata: refund.metadata,
        payment_intent: refund.payment_intent,
        reason: refund.reason,
        receipt_number: refund.receipt_number,
        status: refund.status
    }).save();
}

let getRemboursementByPaiementIntent = (pi) => {
    return RemboursementStripe.find({ payment_intent: pi }).exec();
}

module.exports = {
    createRemboursement,
    getRemboursementByPaiementIntent
}