let express = require('express');
let router = express.Router();
// let passport = require('passport');
// let LocalStrategy = require('passport-local').Strategy;
let League = require('../models/League');
// let User = require('../models/League')


router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('createLeague');
})

router.get('/join/:league_name', ensureAuthenticated, async (req, res) => {
    const leagues = await League.find().populate('league', 'name');
    const leagueAttemptingToJoin = req.params.league_name;
    const user = res.locals.user;
    for (i = 0; i < leagues.length; i++) {
        if (leagues[i].name === leagueAttemptingToJoin) {
            leagues[i].users.push(user);
            user.leagueJoined.push(leagues[i].name)
            leagues[i].save((e,u) => { console.log(`${user.username} has joined the league`); });
            user.save((e,u) => { console.log(`${user.username} has saved the league`); });
        } else {
            console.log("Joining a league function is breaking :(");
        }
    }
    res.redirect('/');
})

router.get('/current', ensureAuthenticated, async (req, res) => {
    const user = res.locals.user;
    console.log(user);
    res.render('currentLeagues', { user });
})

router.get('/join', ensureAuthenticated, async (req, res) => {
    const leagues = await League.find().populate('league', 'name');
    res.render('joinLeague', { leagues });
})

// router.post('/join', ensureAuthenticated, async (req, res) => {
//     const leagues = await League.find().populate('league', 'name');
// })

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