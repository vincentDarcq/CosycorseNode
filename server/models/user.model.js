const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    email: String,
    name: String,
    password: String
});

userSchema.set('timestamps', true);

const User = mongoose.model('user', userSchema);

module.exports = User;