let express = require('express')
let authorize = require('../public/javascript/authorize.js')
let database = require('../public/javascript/dataquery.js')
let router = express.Router()

router.get('/', authorize('user'), async function(req, res, next) {
    console.log('get request on /order')
    let username = req.signedCookies['admin'] || req.signedCookies['user']
    user = await database.get_userdata('NAME', username, "ID")
    let user_id = user[0]['ID']
    let cart = database.get_user_cart(user_id)
    let orderID = await database.get_order_id()
    await database.add_order(orderID, user_id, cart)
    await database.delete_cart(user_id)
    res.render('order', {username: username, orderID: orderID})
  })

module.exports = router
