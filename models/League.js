let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let leagueSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    password: {
        type: String,
        index: true
    },
    budget: {
        type: Number
    },
    subpoints: {
        type: Number
    }
})


let League = module.exports = mongoose.model('League', leagueSchema);

module.exports.createLeague = (newLeague, callback) => {
    console.log('Create League in models being called 1');
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newLeague.password, salt, (err, hash) => {
            newLeague.password = hash;
            newLeague.save(callback);
            console.log('newLeague:', newLeague);
        });
    });
}

module.exports.getLeagueByName = (name, callback) => {
    let query = { name: name };
    League.findOne(query, callback);
}

module.exports.getLeagueById = (id, callback) => {
    League.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback ) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}