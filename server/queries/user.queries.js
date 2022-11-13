const User = require("../models/user.model");

let findUsers = () => {
  return User.find({}).exec();
}

let findUserById = (userId) => {
  return User.findById(userId).exec();
}

let findUsersForNamesStartWith = (value) => {
  return User.find({ "name": { $regex: "^" + value } }).exec();
}

let findUserByMail = (email) => {
  return User.findOne({ 'email': email });
}

let findUserByLastName = (name) => {
  return User.findOne({ 'lastName': name });
}

let findByIdAndUpdate = (id, user) => {
  return User.findByIdAndUpdate({ _id: id }, user, {new: true})
}

let deleteUserByMail = (userEmail) => {
  return User.findOneAndDelete({ email: userEmail }).exec();
}

let deleteUserById = (userId) => {
  return User.findOneAndDelete({ _id: userId }).exec();
}

let editUserPass = (email, pass) => {
  return User.updateOne({ email: email }, { $set: { password: pass } });
}

module.exports = {
  findUsers,
  findUserById,
  findUsersForNamesStartWith,
  findUserByMail,
  findUserByLastName,
  findByIdAndUpdate,
  deleteUserByMail,
  deleteUserById,
  editUserPass
}