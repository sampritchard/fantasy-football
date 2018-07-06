let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
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
    }
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