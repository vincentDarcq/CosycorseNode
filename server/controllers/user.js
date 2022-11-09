const util = require('util');
const fs = require('fs');
const {
  getUserByMail,
  getUserByLastName,
  editUserPass,
  findByIdAndUpdate,
  deleteUserByMail
} = require('../queries/user.queries');

const bcrypt = require('bcryptjs');

exports.uploadPicture = async (req, res, next) => {
  util.inspect(req.files, { compact: false, depth: 5, breakLength: 80, color: true });
  try {
    const user = await getUserByLastName(req.query.user);
    user.picture = req.files.picture[0].filename;
    const updatedUser = await findByIdAndUpdate(user._id, user);
    res.status(200).json(updatedUser);
  } catch (e) {
    next(e);
  }
}

exports.deletePicture = async (req, res, next) => {
  try {
    const user = await getUserByLastName(req.query.user);
    if (user.picture) {
      fs.unlink(path.join(__dirname, `../upload/${user.picture}`), err => {
        if (err) throw err;
      });
    }
    res.status(200).json({});
  } catch (e) {
    next(e);
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await getUserByLastName(req.query.user);
    res.status(200).json(user)
  } catch (e) {
    next(e);
  }
}

exports.resetPass = async (req, res) => {
  try {
    editUserPass(req.body.email, bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))).exec((err, user) => {
      if (err) { res.status(500).json('Une erreur s\'est produite lors du changement de mot de passe'); }
      res.status(200).json(user);
    })
  }catch (e) {
    next(e);
  }
}

exports.editPass = async (req, res) => {
  try {
    getUserByMail(req.body.email).exec((err, user) => {
      if (user && bcrypt.compareSync(req.body.oldPass, user.password)) {
        editUserPass(req.body.email, bcrypt.hashSync(req.body.newPass, bcrypt.genSaltSync(8))).exec((err, user) => {
          if (err) { res.status(500).json('Problème au changement du mdp'); }
          res.status(200).json(user);
        })
      } else {
        res.status(401).json('Ancien mot de passe invalide');
      }
    });
  } catch (e) {
    next(e);
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await deleteUserByMail(req.query.email);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}