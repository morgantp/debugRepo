const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

// done is a request which sends to the api and lets it know that this code block is complete
module.exports = (passport =>{
    passport.use( 
        new LocalStrategy((username, password, done) => {
            User.findOne({ username })
               .then(user => {
                   if (!user) {
                   return done(null, false, { message: 'Incorrect Username' });
                 }
                 bcrypt.compare(password, user.password, (err, isMatch) =>{ // using bcrpyt it's checking if the passwords match
                     if(err) throw err;
                     if(isMatch){
                         return done(null, user);
                     } else {
                         return done(null, false, { message: 'Incorrect Password' });
                     }
                 })
            })
        })
    )})

// create a session entry for the user
passport.serializeUser((user, done) => {
    done(null, user.id)
});

//if logged out it reduces permissions
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})
