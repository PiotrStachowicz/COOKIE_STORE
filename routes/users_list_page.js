let express = require('express')
let router = express.Router()
let authorize = require('../public/javascript/authorize')
const database = require('../public/javascript/dataquery');


router.get('/', authorize('admin'), async function (req, res, next) {
  let user_list = await database.get_users()
  res.render('users_list', { list: user_list })
});


router.post('/', authorize('admin'), async function (req, res, next) {
  let user_list = await database.get_users()
  
  res.render('users_list', {list: user_list })
});


module.exports = router
