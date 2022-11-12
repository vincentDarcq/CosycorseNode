const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const errorTransfertSchema = Schema({
    error: Object,
    date: String,
    logementReservationId: { type: Schema.Types.ObjectId, ref: "logement_reservation" },
    amount: Number,
    destination: String
});

errorTransfertSchema.set('timestamps', true);

const ErrorTransfert = mongoose.model('erreur_transfert', errorTransfertSchema);

module.exports = ErrorTransfert;