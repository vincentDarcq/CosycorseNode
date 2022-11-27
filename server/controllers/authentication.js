const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const RSA_PUBLIC_KEY = fs.readFileSync('./rsa/key.pub');
const RSA_KEY_PRIVATE = fs.readFileSync('./rsa/key');

const { 
  findUsers, 
  findUserByMail,
  findUserById
} = require('../queries/user.queries');
const { 
  signin_failed, 
  check_authent_failed, 
  link_expired, 
  unknow_mail, 
  no_token,
  email_already_exist,
  token_expired,
  ok,
  wrong_token
} = require('../utils/reponses');

let refresh_token = async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
      if (err) { res.status(403).json('token invalid') }
      const newToken = jwt.sign({}, RSA_KEY_PRIVATE, {
        algorithm: 'RS256',
        subject: decoded.sub
      })
      res.status(200).json(newToken);
    })
  } else {
    res.json('no token to refresh');
  }
}

let getUserFromToken = async (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, RSA_PUBLIC_KEY, async (err, decoded) => {
    if (err) { res.status(401).json('token invalid'); }
    const sub = decoded.sub;
    res.locals.user = await findUserById(sub);
    next();
  })
}

let isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
      if (err) { res.status(401).json('token invalid'); }
      const sub = decoded.sub;
      User.findOne({ '_id': sub }).exec((err, user) => {
        if (err || !user) { res.status(500).json('error') }
        user.password = null;
        res.status(200).json(user);
      })
    })
  } else {
    res.status(401).json(no_token);
  }
}

let signin = async (req, res, next) => {
  try {
    findUserByMail(req.body.email).exec((err, user) => {
      if (err) { res.status(500).json(err) }
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({}, RSA_KEY_PRIVATE, {
          algorithm: 'RS256',
          subject: user._id.toString()
        })
        res.status(200).json(token)
      } else {
        res.status(401).json(signin_failed);
      }
    });
  } catch (e) {
    next(e);
  }
}

let signup = async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    firstName: req.body.prenom,
    lastName: req.body.nom,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
    profile_type: req.body.profile_type
  })

  let errUser = "";
  const users = await findUsers();
  users.forEach((user) => {
    if (user.email === newUser.email) {
      errUser = email_already_exist;
    }
  })

  if (errUser !== "") {
    res.status(409).json(errUser)
  } else {
    const user = await newUser.save();
    const token = jwt.sign({}, RSA_KEY_PRIVATE, {
      algorithm: 'RS256',
      subject: user._id.toString()
    })
    res.status(200).json(token);
  }
}

let generateTokenForResetPwd = async (req, res, next) => {
  const mail = req.query.mail;
  try {
    findUserByMail(req.query.mail).exec((err, user) => {
      if (err) { res.status(500).json(err) }
      if(user){
        const token = jwt.sign({}, RSA_KEY_PRIVATE, {
          algorithm: 'RS256',
          subject: mail,
          expiresIn: '15m'
        })
        res.locals.token = token;
        return next();
      }else {
        res.status(404).json(unknow_mail);
      }
    })
  } catch (e) {
    next(e);
  }
}

let authentWithToken = async (req, res, next) => {
  jwt.verify(req.query.token, RSA_PUBLIC_KEY, (err, decoded) => {
    if (err) { res.status(401).json(link_expired); }
    if(decoded){
      const email = decoded.sub;
      findUserByMail(email).exec((err, user) => {
        if (err || !user) { res.status(500).json(err) }
        res.status(200).json(user);
      })
  }})
}

let generateTokenForCreateReservation = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = jwt.sign({}, RSA_KEY_PRIVATE, {
    algorithm: 'RS256',
    subject: auth,
    expiresIn: '6s'
  });
  res.status(200).json(token);
}

let checkTokenForCreateReservation = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = req.headers.token
  if(auth){
    if(token){
      jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
        if (err) { res.status(401).json(token_expired); }
        if(decoded){
          if(decoded.sub === auth){
            next();
          }else {
            res.status(403).json(wrong_token);
          }
      }})
    }else {
      res.status(403).json(no_token);
    }
  }else {
    res.status(403).json(check_authent_failed);
  }
}

module.exports = {
  refresh_token,
  getUserFromToken,
  isLoggedIn,
  signin,
  signup,
  generateTokenForResetPwd,
  authentWithToken,
  generateTokenForCreateReservation,
  checkTokenForCreateReservation
}