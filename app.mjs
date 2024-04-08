import './config.mjs';
import './db.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mongoose from 'mongoose';

const app = express();

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

const Tutor = mongoose.model('Tutor');
const Admin = mongoose.model('Admin');
const Student = mongoose.model('Student');
const Session = mongoose.model('Session');
const Course = mongoose.model('Course');

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('main', {message: "good"});
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    if (req.body.password.length < 8) {
        res.render('register', {message: "Password Too Short"});
    } else {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const username = req.body.username;
        const password = req.body.password;
        if (req.body.role === 'tutor') {
            const tutor = new Tutor({firstname, lastname, username, password});
            await tutor.save();
            console.log("success");
        } else if (req.body.role === 'student') {
            const student = new Student({firstname, lastname, username, password});
            await student.save();
            console.log("success");
        } else if (req.body.role === 'admin') {
            const admin = new Admin({firstname, lastname, username, password});
            await admin.save();
            console.log("success");
        } else {
            res.render('register', {message: "Invalid Role"});
        }
        res.redirect('/login');
    }
});


app.listen(process.env.PORT || 3000);
