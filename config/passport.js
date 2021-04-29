//jshint esversion:6
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
// We should use the User Model by Declaring a const User and call mon
const User = mongoose.model('users');
module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        
    }));
};