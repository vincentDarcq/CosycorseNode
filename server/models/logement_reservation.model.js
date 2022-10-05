const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logementReservationSchema = Schema({
    dateDebut: String,
    dateFin: String,
    emailDemandeur: String,
    logementId: { type: Schema.Types.ObjectId, ref: "logement" }
});

logementReservationSchema.set('timestamps', true);

const LogementReservation = mongoose.model('logement_reservation', logementReservationSchema);

module.exports = LogementReservation;

module.exports.newLogementReservation = function (req) {
    const newLogement = new Logement({
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        emailDemandeur: req.body.emailDemandeur,
        logementId: req.body.logementId
    });
    return newLogement;
}

module.exports.editLogementReservation = function (req) {
    const editLogement = {
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        emailDemandeur: req.body.emailDemandeur,
        logementId: req.body.logementId
    };
    return editLogement;
}