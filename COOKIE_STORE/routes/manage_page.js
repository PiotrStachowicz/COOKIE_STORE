let express = require('express')
let router = express.Router()
let authorize = require('../public/javascript/authorize')
const database = require('../public/javascript/dataquery');
const mssql = require('mssql');

router.get('/', authorize('admin'), function (req, res, next) {
  res.render('manage', { message1: '', message2: '', message3: '', message4: '' })
});

router.post('/', authorize('admin'), async function (req, res, next) {
  let type = req.query['type']
  
  if (type == 'add') {
    let product_name = req.body.name
    let product_price = req.body.price
    await database.set_productdata({ name: product_name, price: product_price })
    res.render('manage', { message1: 'added new product', message2: '', message3: '', message4: '' })
  } else if (type == 'delete') {
    let product_id = req.body.id
    if (await database.check_if_id_exists(product_id)) {
      await database.delete_data('PRODUCTDATA', product_id)
      res.render('manage', { message1: '', message2: 'deleted', message3: '', message4: '' })
    } else {
      res.render('manage', { message1: '', message2: 'wrong id', message3: '', message4: '' })
    }
  } else if (type == 'update-name') {
    let product_id = req.body.id
    let product_name = req.body.name
    if (await database.check_if_id_exists(product_id)) {
      await database.update_productname(product_id, product_name)
      res.render('manage', { message1: '', message2: '', message3: 'updated', message4: '' })
    } else {
      res.render('manage', { message1: '', message2: '', message3: 'wrong id', message4: '' })
    }
  } else if (type == 'update-price') {
    let product_id = req.body.id
    let product_price = req.body.price
    if (await database.check_if_id_exists(product_id)) {
      await database.update_productprice(product_id, product_price)
      res.render('manage', { message1: '', message2: '', message3: '', message4: 'updated' })
    } else {
      res.render('manage', { message1: '', message2: '', message3: '', message4: 'wrong id' })
    }
  }
});

module.exports = router
