const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const Resource = require('../models/Resource.js');
var User = require('../models/User.js');
const crypto = require('crypto');
const logger = require('../models/Logger').logger('index');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'ngTodoApp'
  });
});

// router.post('/pf/openAPI/login', function(req, res, next) {
//   console.log('token' + req.token);
//   console.log('/pf/openAPI/login:' + res.body);
//
//   var code;
//   return User.findOne({
//     userName: req.body.username,
//     password: req.body.password
//   }, function(err, user) {
//     if (err) {
//       code = 500;
//       return res.send({
//         code: code
//       });
//     }
//     code = 200;
//     return res.json({
//       code: code,
//       token: user.token
//     });
//
//   });
//
// });

/* GET url listing. */
router.get('/pf/openAPI', function(req, res, next) {
  Resource.findOne({
    name: "openAPI"
  }, function(err, data) {
    if (err) throw err;
    // object
    console.log(data);
    res.send(data.value);
  });

});

/* post url listing. */
router.post('/pf', function(req, res, next) {
  console.log(JSON.stringify(req.body));

  if (JSON.stringify(req.body) !== '{}') {
    console.log("post str:" + JSON.stringify(req.body));
    //console.log('application/json');
    //能正确解析 json 格式的post参数
    const resource = new Resource(req.body);
    console.log("resource:" + resource);
    resource.save();
    res.send({
      "status": "success",
      "data": req.body
    });
  } else {
    console.log('else:' + JSON.stringify(req.body));
    //不能正确解析json 格式的post参数
    var body = '',
      jsonStr;
    req.on('data', function(chunk) {
      body += chunk; //读取参数流转化为字符串
    });
    req.on('end', function() {
      //读取参数流结束后将转化的body字符串解析成 JSON 格式
      try {
        jsonStr = JSON.parse(body);
      } catch (err) {
        jsonStr = null;
      }
      console.log(jsonStr);
      jsonStr ? res.send({
        "status": "success",
        "transforData": jsonStr
      }) : res.send({
        "status": "error"
      });
    });
  }
});

//register
router.post('/pf/register', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  var user = new User(req.body);
  if (user.username == 'undifiend' || user.password == 'undifined') {
    return res.json({
      "code": "300"
    });
  }
  console.log("\nuser-->" + user);
  try {
    User.findOne({
      userName: req.body.userName
    }, function(err, data) {
      if (err) return res.json({
        "code": "500"
      });
      if (data) return res.json({
        "code": "300",
        "message": "用户已存在"
      });
      user.save(function(err, user) {
        if (err) return res.json({
          "code": "500"
        });
        return res.json({
          "userName": user.userName,
          "token": user.token,
          "code": "200"
        });
      });

    });


  } catch (e) {
    console.log(e);
    res.send({
      "code": "500"
    });
  }
});
//使用token进行登陆
router.post('/pf/openAPI/login', function(req, res, next) {
  console.log('query:');
  console.log(req.query);
  console.log('body:');
  console.log(req.body);
  console.log("token:" + req.token);
  var user = new User(req.body);
  if (user.username == 'undifiend' || user.password == 'undifined') {
    return res.json({
      "code": "300"
    });
  }

  return User.findOne({
    userName: req.body.userName
  }, function(err, data) {
    if (err) return res.json({
      "code": "500"
    });
    if (data) {

      console.log('user salt:' + data.salt);
      return crypto.pbkdf2(req.body.password, data.salt, 10000, 128,
        function(err, hash) {
          if (err) return res.json({
            "code": "500"
          });
          var cryptoPassword = hash.toString('hex');
          console.log("cryptoPassword:" + cryptoPassword);
          if (cryptoPassword === data.password) {
            return res.json({
              "token": data.token,
              "userName": data.userName
            });
          }
          return res.json({
            "code": "302",
            "message": "用户名或者密码错误"
          });
        });
    }
    return res.json({
      "code": "301",
      "message": "用户名不存在"
    });

  });
});



module.exports = router;
