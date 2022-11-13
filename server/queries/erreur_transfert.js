const ErrorTransfert = require('../models/erreur_transfer.model');
const ObjectId = require('mongodb').ObjectId;

let newError = (erreur, date, lrId, amount, destination) => {
    const error = new ErrorTransfert({
        error: erreur,
        date: date,
        logementReservationId: lrId,
        amount: amount,
        destination: destination
    });
    return error;
}

let saveErrorTransfert = (errorTransfert) => {
    return errorTransfert.save();
}

module.exports = {
    newError,
    saveErrorTransfert
}