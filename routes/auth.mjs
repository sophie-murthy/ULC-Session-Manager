import express from 'express';
import mongoose from 'mongoose';
import '../db.mjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const router = express.Router();

const Tutor = mongoose.model('Tutor');
const Admin = mongoose.model('Admin');
const Student = mongoose.model('Student');
const Session = mongoose.model('Session');
const Course = mongoose.model('Course');

async function findUserByUsername(username) {
    let user = await Admin.findOne({ username }).exec();
    if (user) return { user, type: 'admin' };
  
    user = await Tutor.findOne({ username }).exec();
    if (user) return { user, type: 'tutor' };
  
    user = await Student.findOne({ username }).exec();
    if (user) return { user, type: 'student' };
  
    return null;
  }

  passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const { user, type } = await findUserByUsername(username);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            user.type = type;
            return done(null, user);
        } catch (error){
            return done(error);
        }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, { id: user.id, type: user.type });
  });

  passport.deserializeUser(async function(obj, done) {
    
    try {
        let dbUser;
        if (obj.type === 'admin') {
            dbUser = await Admin.findById(obj.id).exec();
            dbUser.type = 'admin';
        } else if (obj.type === 'tutor') {
            dbUser = await Tutor.findById(obj.id).exec();
            dbUser.type = 'tutor';
        } else if (obj.type === 'student') {
            dbUser = await Student.findById(obj.id).exec();
            dbUser.type = 'student';
        }

        if (dbUser) {
            done(null, dbUser);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (error) {
        done(error, null);
    }
});
