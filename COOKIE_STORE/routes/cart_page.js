let express = require('express')
let authorize = require('../public/javascript/authorize.js')
const dataquery = require('../public/javascript/dataquery.js')
let router = express.Router()
let database = require('../public/javascript/dataquery.js')


router.get('/', authorize('user'), async function(req, res, next) {
  console.log(`get request on /cart`)
  let username = req.signedCookies['admin'] || req.signedCookies['user']

  user = await dataquery.get_userdata('NAME', username, "ID")

  let ID_array = await database.get_user_cart(user[0]['ID'])
  let array = []

  for(element of ID_array){

    if(!array.includes(element['PRODUCT_ID'])){
      let product = await database.get_productdata("ID", element['PRODUCT_ID'])
      array.push(product[0])
    }
  }

  res.render('cart', {products: array})
})

router.post('/', authorize('user'), async function(req, res) {
  console.log(`post request on /cart`)
  let action = req.body.action;
  let productID = req.body.productID;
  let username = req.signedCookies['admin'] || req.signedCookies['user'];
  user = await dataquery.get_userdata('NAME', username, "ID");

  if (action === 'add') {
    await database.add_to_user_cart(user[0]['ID'], productID)
  } else if (action === 'remove') {
    await database.delete_from_user_cart(user[0]['ID'], productID)
  }
  res.redirect('/cart')
});


module.exports = router
