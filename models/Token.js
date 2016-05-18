const mongoose = require('mongoose');
const settings = require('../config/settings');
const jwt = require('jsonwebtoken');
var User = require('./User');
const crypto = require('crypto');
var getToken;
//token过期时间
const EXPIRE_TIME = settings.tokenExpirationMin * 60 * 1000;

//当token失效或者错误返回401
exports.unauthHander = function(err, req, res, next) {
  if (err.name == 'UnauthorizedError') {
    return res.sendStatus(401);
  } else {
    next()
  }
}
exports.verifyToken = function(req, res, next) {
  var selector, token, userName;
  token = getToken(req.headers);
  userName = req.user.userName || '';
  selector = {
    token: token,
    userName: userName
  };
  return User.findOne(selector, function(err, tokenResult) {
    if (err) {
      return res.sendStatus(500);
    }
    if (tokenResult) {
      if (tokenResult.expireDate > new Date()) {
        return next();
      } else {
        return res.sendStatus(401);
      }
    } else {
      return res.sendStatus(401);
    }
  });
};

exports.createToken = function(userId, cb) {
  var info, options, selector, token, update, updateOptions;
  info = {
    id: userId
  };
  options = {
    expiresInMinutes: settings.tokenSecret
  };
  token = jwt.sign(info, settings.tokenSecret, options);
  selector = {
    _id: userId
  };
  update = {
    _id: userId,
    token: token,
    expireDate: new Date(Date.parse(new Date()) + EXPIRE_TIME)
  };
  updateOptions = {
    upsert: true
  };
  return User.update(selector, update, updateOptions, function(err,
    numberAffected) {
    if (err) {
      console.log(err);
      return cb(err);
    } else {
      if (numberAffected > 0) {
        return cb(null, token);
      } else {
        return cb('Saving in database failed.');
      }
    }
  });
};

getToken = function(headers) {
  var authorization, part;
  if (headers && headers.authorization) {
    authorization = headers.authorization;
    part = authorization.split(' ');
    if (part.length === 2) {
      return part[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
