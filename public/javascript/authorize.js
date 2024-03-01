function authorize(name) {
    return function (req, res, next) {
        if (req.signedCookies[name] || req.signedCookies['admin']) {
            next()
        } else {
            res.redirect('/')
        }
    }
}

module.exports = authorize