let express = require('express');
let router = express.Router();
let database = require('../public/javascript/dataquery')


router.get('/', function (req, res, next) {
  res.render('register', { message: '', message1: '' });
});


router.post('/', async function (req, res, next) {
  let username = req.body.username
  let password = req.body.password
  let result = await database.get_userdata('NAME', username, 'PSSWRD')
  let exists = result[0] || undefined

  if (exists === undefined && username != 'Admin') {
    await database.save_user_info(username, password)
    res.cookie('user', username, { signed: true })
    res.cookie('admin', '', { maxAge: -1 })
    res.redirect('/');
  } else {
    res.render('register', { message: '', message1: 'username already exists' });
  }
});


module.exports = router;