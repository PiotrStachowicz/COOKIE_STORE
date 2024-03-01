let express = require('express')
let path = require('path')
let cookie_parser = require('cookie-parser')


// routes
let home_router = require('./routes/home_page')
let login_router = require('./routes/login_page')
let logout_router = require('./routes/logout_page')
let cart_router = require('./routes/cart_page')
let manage_router = require('./routes/manage_page')
let register_router = require('./routes/register_page')
let order_router = require('./routes/order_page')
let orders_list_router = require('./routes/orders_list_page')
let users_list_router = require('./routes/users_list_page')
let app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))


// middlewear
app.use(express.urlencoded({ extended: true }))
app.use(cookie_parser("vnjk@vn2321#$djavdnjo11231"))
app.use(express.static(path.join(__dirname, 'public')))


// user routing 
app.use('/', home_router)
app.use('/login', login_router)
app.use('/logout', logout_router)
app.use('/cart', cart_router)
app.use('/manage', manage_router)
app.use('/register', register_router)
app.use('/order', order_router)
app.use('/orders_list', orders_list_router)
app.use('/users_list', users_list_router)


// error handling
app.use(function(err, req, res, next) {
  res.render('error', {message: err.message, id: err.status || 500})
})


module.exports = app