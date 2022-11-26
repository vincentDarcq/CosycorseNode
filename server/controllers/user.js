const util = require('util');
const fs = require('fs');
const {
  findUserByMail,
  findUserByLastName,
  editUserPass,
  findByIdAndUpdate,
  deleteUserById
} = require('../queries/user.queries');

const bcrypt = require('bcryptjs');
const { deleteStripeAccount } = require('../stripe/account');
const { getLogementByEmailAnnonceur, deleteOne } = require('../queries/logement.queries');
const { getReservationsByLogementId } = require('./logement_reservation');
const { getDateFromStringDate } = require('../utils/dates');
const { deleteImage } = require('./logement');
const { updateLogementReservation, getReservationsByEmailAnnonceur } = require('../queries/logement_reservation.queries');
const { 
  logement_reservation_not_started_while_user_deletion_asked, 
  error_pwd_changed, 
  invalid_old_pwd
} = require('../utils/reponses');

let uploadPicture = async (req, res, next) => {
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

let deletePicture = async (req, res, next) => {
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

let getUserByLastName = async (req, res, next) => {
  try {
    const user = await findUserByLastName(req.query.user);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}

let getUserByMail = async (req, res, next) => {
  try {
    const user = await findUserByMail(req.query.email);
    res.status(200).json(user);
  }catch(e){
    next(e);
  }
}

let resetPass = async (req, res) => {
  try {
    editUserPass(req.body.email, bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))).exec((err, user) => {
      if (err) { res.status(500).json(error_pwd_changed); }
      res.status(200).json(user);
    })
  }catch (e) {
    next(e);
  }
}

let editPass = async (req, res, next) => {
  try {
    findUserByMail(req.body.email, next).exec((err, user) => {
      if(err){res.status(500).json(err)}
      else if (user && bcrypt.compareSync(req.body.oldPass, user.password)) {
        editUserPass(req.body.email, bcrypt.hashSync(req.body.newPass, bcrypt.genSaltSync(8))).exec((err, user) => {
          if (err) { res.status(500).json(error_pwd_changed); }
          res.status(200).json(user);
        })
      } else {
        res.status(401).json(invalid_old_pwd);
      }
    });
  } catch (e) {
    next(e);
  }
}

let deleteUser = async (req, res, next) => {
  try {
    const logRes = await getReservationsByEmailAnnonceur(req.query.userEmail);
    let reservation_not_started;
    if(logRes.length > 0){
      logRes.forEach( lr => {
        const now = new Date();
        now.setHours(now.getHours()+1);
        const lr_dd = getDateFromStringDate(lr.dateDebut);
        reservation_not_started = (lr_dd.getTime() - now.getTime()) > 0;
      })
      if(reservation_not_started){
        res.status(409).json(logement_reservation_not_started_while_user_deletion_asked);
      }else {
        const user = await deleteCompleteUser(req.query.userId, req.query.userEmail, req.query.stripeUserId);
        res.status(200).json(user);
      }
    }else {
      const user = await deleteCompleteUser(req.query.userId, req.query.userEmail, req.query.stripeUserId);
      res.status(200).json(user);
    }
  } catch (e) {
    next(e);
  }
}

module.exports = {
  uploadPicture,
  deletePicture,
  getUserByLastName,
  getUserByMail,
  resetPass,
  editPass,
  deleteUser
}

let deleteCompleteUser = async (userId, userEmail, stripeUserId) => {
  const logements = await getLogementByEmailAnnonceur(userEmail);
  if(logements.length > 0){
    logements.forEach(async l => {
      l.images.forEach(i => deleteImage(i));
      const lrs = await getReservationsByLogementId(l._id);
      lrs.forEach( async lr => {
        lr.logementExist = false;
        await updateLogementReservation(lr);
      })
      await deleteOne(l._id);
    })
  }
  if(stripeUserId){
    await deleteStripeAccount(stripeUserId);
  }
  return await deleteUserById(userId);
}