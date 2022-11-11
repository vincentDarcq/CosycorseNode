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
});

logementReservationSchema.set('timestamps', true);

const LogementReservation = mongoose.model('logement_reservation', logementReservationSchema);

module.exports = LogementReservation;

module.exports.newLogementReservation = function (req) {
    const newLogement = new LogementReservation({
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        message: req.body.message,
        prix: req.body.prix,
        emailDemandeur: req.body.emailDemandeur,
        emailAnnonceur: req.body.emailAnnonceur,
        logementId: req.body.logementId,
        pm: req.body.pm,
        pi: req.body.pi,
        status: "attente"
    });
    return newLogement;
}

module.exports.editLogementReservation = function (req) {
    const editLogement = {
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        message: req.body.message,
        prix: req.body.prix,
        emailDemandeur: req.body.emailDemandeur,
        annonceur: req.body.annonceur,
        accepte: req.body.accepte,
        logementId: req.body.logementId
    };
    return editLogement;
}