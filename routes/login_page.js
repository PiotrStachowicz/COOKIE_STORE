let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let database = require('../public/javascript/dataquery')
const COOKIE_EXPIRATION_TIME = 2592000000 // 30 days in ms


async function get_user_psswrd(username) {
  var result = await database.get_userdata('NAME', username, 'PSSWRD')
  
  if (result[0] === undefined) {
    return undefined
  } else {
    return result[0].PSSWRD
  }
}


router.get('/', function (req, res, next) {
  res.render('login', { message: '', message1: '' });
});


router.post('/', async function (req, res, next) {
  let username = req.body.username
  let password = req.body.password
  let psswrd = await get_user_psswrd(username)

  if (username === 'Admin' && await bcrypt.compare(password, psswrd)) {
    res.cookie('admin', username, { signed: true, maxAge: COOKIE_EXPIRATION_TIME })
    res.cookie('user', '', { maxAge: -1 })
    res.redirect('/')
  } else if (psswrd !== undefined && await bcrypt.compare(password, psswrd)) {
    res.cookie('user', username, { signed: true, maxAge: COOKIE_EXPIRATION_TIME })
    res.cookie('admin', '', { maxAge: -1 })
    res.redirect('/');
  } else {
    res.render('login', { message: 'incorrect username or password', message1: '' });
  }
});


module.exports = router;