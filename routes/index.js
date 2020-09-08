var express = require('express');
var router = express.Router();
var Userdata = require("../model/userdb")
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


function CheckLoginUser(req, res, next) {
  var userToken = localStorage.getItem("userToken")
  try {
    var decoded = jwt.verify(userToken, "LoginToken");
  } catch (err) {
    res.redirect("/")
  }
  next()
}

function emailCheck(req, res, next) {
  var email = req.body.email
  var emailCheck = Userdata.findOne({ email: email })
  emailCheck.exec(function (e, data) {
    if (data) {
      return res.render('signup', { title: 'Signup', msg: "EMAIL ALREADY IN DATABASE" });
    }

    next()
  })
}

function nameCheck(req, res, next) {
  var name = req.body.name
  var nameCheck = Userdata.findOne({ name: name })
  nameCheck.exec(function (e, data) {
    if (data) {
      return res.render('signup', { title: 'Signup', msg: "Name ALREADY IN DATABASE" });
    }

    next()
  })
}




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Login', msg: "" });
});

router.post('/', function (req, res, next) {
  var email = req.body.email
  var password = req.body.password
  var Checkuser = Userdata.findOne({ email: email })
  Checkuser.exec((err, data) => {
    if (err) { throw err }


    var getpassword = data.password
    var getUserId = data._id
    var username = data.name
    if (bcrypt.compareSync(password, getpassword)) {
      var token = jwt.sign({ userId: getUserId }, 'LoginToken');
      localStorage.setItem("userToken", token)
      localStorage.setItem("loginUser", username)
      res.redirect("/dasboard")

    } else {
      res.render('index', { title: 'Login', msg: "WRONG PASSWORD" });
    }
  })

});

router.get('/dasboard', CheckLoginUser, function (req, res, next) {
  var loginuser = localStorage.getItem("loginUser")

  res.render('dasboard', { title: 'dashboard', loginUser: loginuser, msg: "" });
});


router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Signup', msg: "" });
});

router.post('/signup', emailCheck, nameCheck, function (req, res, next) {
  var name = req.body.name
  var email = req.body.email
  var password = req.body.password
  password = bcrypt.hashSync(req.body.password, 10)
  var user = new Userdata({

    name: name,
    email: email,
    password: password

  })

  user.save().then().catch(err => console.log(err))
  res.render('signup', { title: 'Signup', msg: "" });




});

router.get('/logout', function (req, res, next) {
  localStorage.removeItem("userToken")
  localStorage.removeItem("loginUser")
  res.redirect("/")
});



module.exports = router;
