let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/register', (req, res) => {
    let username = req.body.username;
    let name = req.body.name;
    let email = req.body.email;
    let teamname = req.body.teamname;
    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('username', 'Username is Required').notEmpty();
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
            username: username,
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

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.getUserByUsername(username, (err, user) => {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid Password'});
                }
            })
        });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
      done(err, user);
    });
  });

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  (req, res) => {
    res.redirect('/');
  });

module.exports = router;
