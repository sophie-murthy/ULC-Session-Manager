import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { Tutor, Admin, Student } from './db.mjs';

const router = express.Router();

passport.use(new LocalStrategy(
    function(username, password, done) {
        Tutor.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));