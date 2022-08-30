const User = require("../models/user.model");

exports.getUsers = () => {
  return User.find({}).exec();
}

exports.findUsersForNamesStartWith = (value) => {
  return User.find({ "name": { $regex: "^" + value } }).exec();
}

exports.getUserByMail = (email) => {
  return User.findOne({ 'email': email });
}

exports.getUserByName = (name) => {
  return User.findOne({ 'name': name });
}

exports.findByIdAndUpdate = (id, user) => {
  return User.findByIdAndUpdate({ _id: id }, user)
}

exports.deleteUserByMail = (userEmail) => {
  return User.findOneAndDelete({ email: userEmail }).exec();
}

exports.addFriend = (name, ami) => {
  return User.updateOne({ name: name }, { $push: { amis: ami } }).exec();
}

exports.deleteFriend = (name, ami) => {
  return User.updateOne({ name: name }, { $pull: { amis: ami } }).exec();
}

exports.editUserPass = (email, pass) => {
  return User.updateOne({ email: email }, { $set: { password: pass } });
}