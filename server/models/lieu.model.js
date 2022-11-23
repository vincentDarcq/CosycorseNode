const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lieuSchema = Schema({
    nom: String,
    ville: String,
    type: String,
    description: String,
    latitude: Number,
    longitude: Number,
    annonceur: String,
    images: [String]
});

lieuSchema.set('timestamps', true);

const Lieu = mongoose.model('lieu', lieuSchema);

module.exports = Lieu;