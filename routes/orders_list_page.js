let express = require('express')
let router = express.Router()
let authorize = require('../public/javascript/authorize')
const database = require('../public/javascript/dataquery');


router.get('/', authorize('admin'), async function (req, res, next) {
  let orders_list = await database.get_orders()
  res.render('orders_list', { list: orders_list})
});


router.post('/', authorize('admin'), async function (req, res, next) {
  let orders_list = await database.get_orders()
  let action = req.body.action
  if(action === 'fulfill'){
    await database.update_order_status(req.body.ID);
  }
  res.render('orders_list', {list: orders_list })
});


module.exports = router
