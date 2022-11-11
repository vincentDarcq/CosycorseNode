const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const RSA_PUBLIC_KEY = fs.readFileSync('./rsa/key.pub');
const RSA_KEY_PRIVATE = fs.readFileSync('./rsa/key');

const { 
  getUsers, 
  getUserByMail,
  getUserById
} = require('../queries/user.queries');

exports.refresh_token = async (req, res) => {
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

exports.getUserFromToken = async (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, RSA_PUBLIC_KEY, async (err, decoded) => {
    if (err) { res.status(401).json('token invalid'); }
    const sub = decoded.sub;
    res.locals.user = await getUserById(sub);
    next();
  })
}

exports.isLoggedIn = async (req, res, next) => {
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
    res.status(401).json('pas de token');
  }
}

exports.signin = async (req, res, next) => {
  try {
    getUserByMail(req.body.email).exec((err, user) => {
      if (err) { res.status(500).json(err) }
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({}, RSA_KEY_PRIVATE, {
          algorithm: 'RS256',
          subject: user._id.toString()
        })
        res.status(200).json(token)
      } else {
        res.status(401).json('signin fail');
      }
    });
  } catch (e) {
    next(e);
  }
}

exports.signup = async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    firstName: req.body.prenom,
    lastName: req.body.nom,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
    profile_type: req.body.profile_type
  })

  let errUser = "";
  const users = await getUsers();
  users.forEach((user) => {
    if (user.email === newUser.email) {
      errUser = "Cet email est déjà enregistré";
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

exports.generateTokenForResetPwd = async (req, res, next) => {
  const mail = req.query.mail;
  try {
    getUserByMail(req.query.mail).exec((err, user) => {
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
        res.status(404).json("Adresse email inconnue")
      }
    })
  } catch (e) {
    next(e);
  }
}

exports.authentWithToken = async (req, res, next) => {
  jwt.verify(req.query.token, RSA_PUBLIC_KEY, (err, decoded) => {
    if (err) { res.status(401).json('Ce lien a expiré'); }
    if(decoded){
      console.log("good token")
      const email = decoded.sub;
      getUserByMail(email).exec((err, user) => {
        if (err || !user) { res.status(500).json('error') }
        res.status(200).json(user);
      })
    }})
}