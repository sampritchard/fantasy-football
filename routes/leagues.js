let express = require('express');
let router = express.Router();
let League = require('../models/League');

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('createLeague');
})

router.get('/join', ensureAuthenticated, async (req, res) => {
    const leagues = await League.find().populate('league', 'name');
    res.render('joinLeague', { leagues });
})

router.post('/create', (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let budget = req.body.budget;
    let subpoints = req.body.subpoints;

    req.checkBody('name', 'League Name is Required').notEmpty();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('budget', 'Budget is Required').notEmpty();
    req.checkBody('subpoints', 'Subpoints is Required').notEmpty();
    
    const errors = req.validationErrors();

    if (errors) {
        res.render('createLeague');
        console.log('You are not entering your details correctly');
    } else {
        let newLeague = new League({
            name: name,
            password: password,
            budget: budget,
            subpoints: subpoints
        });

        League.createLeague(newLeague, (err, league) => {
            if (err) throw err;
            console.log('league:', league);
        });

        res.redirect('/');
    }
})

exports.listLeagues = async (req, res) => {
    console.log('List Leagues function')
    
  };

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