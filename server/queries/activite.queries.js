const Activite = require('../models/activite.model');

let createActivite = (activite) => {
    return activite.save();
}

let findAllActivites = () => {
    return Activite.find({}).exec();
}

let findActiviteById = (activiteId) => {
    return Activite.findById(activiteId).exec();
}

let findActiviteByIdAndUpdate = (id, activite) => {
    return Activite.findByIdAndUpdate({ _id: id }, activite, {new: true})
}

let findActivitesByFilters = (titre, ville, type) => {
    return Activite.find({
        titre: titre ? { $regex: titre, $options : 'i' } : {$exists: true},
        ville: ville ? ville : {$exists: true},
        type: type ? type : {$exists: true}
    });
}


module.exports = {
    createActivite,
    findAllActivites,
    findActiviteById,
    findActiviteByIdAndUpdate,
    findActivitesByFilters
}