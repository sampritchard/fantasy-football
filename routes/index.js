let express = require('express');
let router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index');
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('Log in to view the dashboard')
        req.flash('error_msg', 'You need to be logged in to view')
        res.redirect('/users/login');
    }
}

module.exports = router;
