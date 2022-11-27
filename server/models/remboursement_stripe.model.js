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
