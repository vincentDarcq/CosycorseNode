const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logementSchema = Schema({
    adresse: String,
    ville: String,
    description: String,
    logement: String,
    voyageurs: Number,
    lits: Number,
    sdbs: Number,
    latitude: Number,
    longitude: Number,
    emailAnnonceur: String,
    prix: Number,
    equipements: [String],
    images: [String],
    fumeur: Boolean,
    animaux: Boolean,
    access_handicap: Boolean,
    exposer: Boolean
});

logementSchema.set('timestamps', true);

const Logement = mongoose.model('logement', logementSchema);

module.exports = Logement;