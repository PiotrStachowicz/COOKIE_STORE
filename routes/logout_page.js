let express = require('express')
let router = express.Router()


router.get('/', function (req, res, next) {
  res.cookie('admin', '', { maxAge: -1 })
  res.cookie('user', '', { maxAge: -1 })
  res.redirect('/')
});


module.exports = router