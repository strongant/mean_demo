// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
var User = require('../models/User');
const crypto = require('crypto');
var txt = "admin";
crypto.randomBytes(128, function(err, salt) {
  if (err) {
    throw err;
  }
  salt = salt.toString('hex');
  console.log(salt); //生成salt

  crypto.pbkdf2(txt, salt, 4096, 256, function(err, hash) {
    if (err) {
      throw err;
    }
    hash = hash.toString('hex');
    console.log(hash); //生成密文
  });
});
