const crypto = require('crypto');
module.exports.cryptoPassword = function(value) {
  if (value == 'undifiend') {
    throw "value is must not empty";
  } else {
    crypto.randomBytes(128, function(err, salt) {
      if (err) {
        throw err;
      }
      var saltValue = salt.toString('hex');
      crypto.pbkdf2(value, saltValue, 4096, 256, function(err, hash) {
        if (err) {
          throw err;
        }
        var scert = hash.toString('hex');
        return scert;
      });
    });
  }
};
