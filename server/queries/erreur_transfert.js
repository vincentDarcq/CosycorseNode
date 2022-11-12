const ErrorTransfert = require('../models/erreur_transfer.model');
const ObjectId = require('mongodb').ObjectId;

module.exports.newError = (erreur, date, lrId, amount, destination) => {
    const error = new ErrorTransfert({
        error: erreur,
        date: date,
        logementReservationId: lrId,
        amount: amount,
        destination: destination
    });
    return error;
}

exports.saveErrorTransfert = (errorTransfert) => {
    return errorTransfert.save();
}