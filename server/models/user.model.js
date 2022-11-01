const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    stripeUserId: String
});

userSchema.set('timestamps', true);

const User = mongoose.model('user', userSchema);

module.exports = User;