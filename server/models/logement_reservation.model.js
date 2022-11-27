const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logementReservationSchema = Schema({
    dateDebut: String,
    dateFin: String,
    emailDemandeur: String,
    prix: Number,
    message: String,
    emailAnnonceur: String,
    status: String,
    pm: String,
    pi: String,
    logementId: { type: Schema.Types.ObjectId, ref: "logement" },
    paye: Boolean,
    logementExist: Boolean
});

logementReservationSchema.set('timestamps', true);

const LogementReservation = mongoose.model('logement_reservation', logementReservationSchema);

module.exports = LogementReservation;