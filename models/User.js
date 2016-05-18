var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
  salt: String,
  token: String,
  createDate: {
    type: Date,
    default: Date.now
  },
  //token过期时间
  expireDate: Date
});



UserSchema.pre('save', function(next) {
  var user = this;
  user.token = jwt.sign(user, "process.env.JWT_SECRET");
  var salt = crypto.randomBytes(128).toString('base64');
  user.salt = salt;
  crypto.pbkdf2(user.password, salt, 10000, 128, function(err, hash) {
    user.password = hash.toString('hex');
    next();
  });

});


// exports.login = function(req, res) {
//   var password, selector, userName;
//   userName = req.body.userName || '';
//   password = req.body.password || '';
//   if (userName === '' || password === '') {
//     return res.send(401);
//   }
//   selector = {
//     'userName': userName
//   };
//   return User.findOne(selector, function(err, user) {
//     if (err || !user) {
//       return res.sendStatus(401);
//     }
//     return tokenManage.createToken(user._id, function(err, token) {
//       if (err) {
//         return res.sendStatus(401);
//       } else {
//         return res.json({
//           token: token
//         });
//       }
//     });
//   });
// };



UserSchema.path('userName').validate(function(name) {
  return name != 'undifiend';
}, 'userName cannot be blank');
UserSchema.path('password').validate(function(value) {
  return value != 'undifiend';
}, 'password cannot be blank');
UserSchema.methdos = {
  save: function() {
    var err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    return this.save();
  },
  findByUserName: function(value) {
    return this.findOne({
      userName: value
    });
  }
};
module.exports = mongoose.model('User', UserSchema)
