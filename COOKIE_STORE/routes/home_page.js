let express = require('express');
let router = express.Router();
const database = require('../public/javascript/dataquery');
const COOKIE_EXPIRATION_TIME = 2592000000 // 30 days in ms

function is_logged(req){
  if(req.signedCookies['admin'] != undefined || req.signedCookies['user'] != undefined){
    return true
  }else{
    return false
  }
}

router.route('/')
  .get(async function(req, res, next) {
    console.log('get request on /');
    await handle_request(req, res);
  }).post(async function(req, res, next) {
    console.log('post request on /');
    await handle_request(req, res);
  })

async function handle_request(req, res, next) {
  let username = ""
  let logged = false
  let admin = false
  let searchTerm = req.query['searchTerm']
  if (searchTerm === undefined) searchTerm = ''
  searchTerm = '%' + searchTerm + '%'
  let products = await database.get_products(searchTerm)
  
  if(req.signedCookies['admin']){
    username = req.signedCookies.admin
    logged = true
    admin = true
  }else if(req.signedCookies['user']){
    username = req.signedCookies.user
    logged = true
  }
  
  if(is_logged(req)){
    let id = req.query.id
    if(id != undefined){
      user = await database.get_userdata('NAME', username, "ID")
      database.add_to_user_cart(user[0]['ID'], id)
    }
  }
  
  res.render('home', { username: username, logged: logged, admin: admin, products: products });
};

module.exports = router;
