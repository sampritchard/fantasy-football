let express = require('express');
let router = express.Router();
let User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/register', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let teamname = req.body.teamname;
    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('name', 'Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('email', 'Email is Not Valid').isEmail();
    req.checkBody('teamname', 'Team Name is Required').notEmpty();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('password', 'Passwords Do Not Match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        res.render('register');
        console.log('You are not entering your details correctly');
    } else {
        let newUser = new User({
            name: name,
            email: email,
            teamname: teamname,
            password: password
        });

        User.createUser(newUser, (err, user) => {
            if (err) throw err;
            console.log('user:', user);
        });

        res.redirect('/users/login');
    }
})

module.exports = router;
