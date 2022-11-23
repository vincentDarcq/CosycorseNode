const path = require('path');
const fs = require('fs');

let deleteImage = (imageToRemove) => {
    fs.unlink(path.join(__dirname, `../upload/${imageToRemove}`), err => {
        if (err) throw err;
    });
}

module.exports = {
    deleteImage
}