const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activiteSchema = Schema({
    titre: String,
    proposeur: String,
    type: String,
    duree: String,
    description: String,
    ville: String,
    latitude: Number,
    longitude: Number,
    annonceur: String,
    images: [String]
});

activiteSchema.set('timestamps', true);

const Activite = mongoose.model('activite', activiteSchema);

module.exports = Activite;