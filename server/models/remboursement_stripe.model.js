const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const remboursementSchema = Schema({
    id: String,
    amount: Number,
    currency: String,
    metadata: Object,
    payment_intent: String,
    reason: String,
    receipt_number: Number,
    status: String
});

remboursementSchema.set('timestamps', true);

const RemboursementStripe = mongoose.model('remboursement_stripe', remboursementSchema);

module.exports = RemboursementStripe;

module.exports.newRemboursement = function (refund) {
    const newRemboursement = new RemboursementStripe({
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        metadata: refund.metadata,
        payment_intent: refund.payment_intent,
        reason: refund.reason,
        receipt_number: refund.receipt_number,
        status: refund.status
    });
    return newRemboursement;
}