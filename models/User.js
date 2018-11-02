let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    teamname: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    leagueJoined: []
})

let User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = (newUser, callback) => {
    console.log('Create User in models being called 1');
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
            console.log('newUser:', newUser);
        });
    });
}

module.exports.getUserByUsername = (username, callback) => {
    let query = { username: username };
    User.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback ) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}