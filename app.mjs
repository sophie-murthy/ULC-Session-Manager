import './config.mjs';
import './db.mjs';
import passport from 'passport';
import './routes/auth.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mongoose from 'mongoose';
import flash from 'connect-flash';

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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const Tutor = mongoose.model('Tutor');
const Admin = mongoose.model('Admin');
const Student = mongoose.model('Student');
const Session = mongoose.model('Session');
const Course = mongoose.model('Course');

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            res.render('admin', {user: req.user});
        } else if (req.user.type === 'tutor') {
            res.render('tutor', {user: req.user});
        } else if (req.user.type === 'student') {
            res.render('student', {user: req.user});
        } else {
            res.render('login', {message: "something wrong"})
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    const messages = req.flash('error');
    res.render('login', {message: messages});
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    if (req.body.password.length < 8) {
        res.render('register', {message: "Password Too Short"});
        return;
    }
    const student = await Student.findOne({username: req.body.username});
    const tutor = await Tutor.findOne({username: req.body.username});
    const admin = await Admin.findOne({username: req.body.username});
    if (student || tutor || admin) {
        res.render('register', {message: "Username Already Exists"});
    } else {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const username = req.body.username;
        const password = req.body.password;
        if (req.body.role === 'tutor') {
            const tutor = new Tutor({firstname, lastname, username, password});
            await tutor.save();
        } else if (req.body.role === 'student') {
            const student = new Student({firstname, lastname, username, password});
            await student.save();
        } else if (req.body.role === 'admin') {
            const admin = new Admin({firstname, lastname, username, password});
            await admin.save();
        } else {
            res.render('register', {message: "Invalid Role"});
        }
        res.redirect('/login');
    }
});

app.get('/settings', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            res.render('adminsettings', {user: req.user});
        } else if (req.user.type === 'tutor') {
            res.render('tutorsettings', {user: req.user});
        } else if (req.user.type === 'student') {
            res.render('studentsettings', {user: req.user});
        }
    } else {
        res.redirect('/login');
    
    }
});

app.post('/settings', async (req, res) => {
    if (req.user.type === 'tutor') {
        const user = await Tutor.findById(req.user.id).exec();
        const coursetitle = req.body.title;
        const courseprofessor = req.body.professor;
        const course = await Course.findOne({title: coursetitle, professor: courseprofessor});
        if (course) {
            user.courses.push(course);
            await user.save();
        } else {
            const newcourse = new Course({title: coursetitle, professor: courseprofessor});
            await newcourse.save();
            user.courses.push(newcourse);
            await user.save();
        }
    } else if (req.user.type === 'student') {
        const user = await Student.findById(req.user.id).exec();
        const coursetitle = req.body.title;
        const courseprofessor = req.body.professor;
        const course = await Course.findOne({title: coursetitle, professor: courseprofessor});
        if (course) {
            user.courses.push(course);
            await user.save();
        } else {
            const newcourse = new Course({title: coursetitle, professor: courseprofessor});
            await newcourse.save();
            user.courses.push(newcourse);
            await user.save();
        }
    }
    res.redirect('/settings');
});

app.get('/api/current_user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});




app.listen(process.env.PORT || 3000);
