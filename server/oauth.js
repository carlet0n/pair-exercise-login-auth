const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('./db')
const Sequelize = require('sequelize')
const express = require('express');
module.exports = router



passport.use(
    new GoogleStrategy({
        clientID: '24284724477-l3vmd1vjuvuv75rvha19daln1rqlfulu.apps.googleusercontent.com',
        clientSecret: 'DSCSQCCO2i-nyq1kFDBk8FJe',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    async (token, refreshToken, profile, done) => {
        try {
        const [instance, wasCreated] = await User.findOrCreate({
            where: {
                googleId: profile.id
            },
            email: profile.emails[0].value
        })
        done(instance)
    } catch(err) {console.log(err)}
        
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById(id)
    done(null, user)
    } catch(err) {console.log(err)}
})



router.get('/', passport.authenticate('google', { scope: 'email' }));

router.get('/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/'
    }))