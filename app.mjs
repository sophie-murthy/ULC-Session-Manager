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

app.get('/api/current_user', async (req, res) => {
    if (req.isAuthenticated()) {
        const sessions = await Session.find({students: req.user});
        res.json({user: req.user, session: sessions});
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

app.delete('/api/current_user', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'student') {
            const user = await Student.findById(req.user.id).exec();
            const sessions = await Session.find({students: user});
            for (const session of sessions) {
                if (session.status === 'pending') {
                    await Session.deleteOne({_id: session._id});
                }
            }
        }
        res.status(204).end();
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

app.get('/api/sessions', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            console.log('admin');
            const sessions = await Session.find();
            res.json(sessions);
        } else if (req.user.type === 'tutor') {
            const user = await Tutor.findById(req.user.id).exec();
            const sessions = await Session.find({tutor: user});
            res.json(sessions);
        } else {
            res.status(401).json({ error: 'User not authorized' });
        
        }
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

app.post('/student' , async (req, res) => {
    const user = await Student.findById(req.user.id).exec();
    const coursename = req.body.course;
    const course = await Course.findOne({_id: coursename});
    const date = new Date();
    const estTime = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
    console.log(estTime);
    const time = estTime.split(",")[1].split(":").join(":");
    console.log(time);
    const newSession = new Session({tutor: null, students: [user], course: course, start: time, end: null, location: null, status: 'pending', evaluation: null});
    console.log(newSession.start)
    await newSession.save();
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

app.get('/users', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            const tutors = await Tutor.find();
            const students = await Student.find();
            res.render('allusers', {tutors: tutors, students: students});
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }   
});


app.get('/search-students', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            if (req.query.firstname === '' && req.query.lastname === '') {
                const students = await Student.find();
                res.render('allusers', {students: students});
            } else if (req.query.firstname === '') {
                const students = await Student.find({lastname: req.query.lastname});
                res.render('allusers', {students: students});
            } else if (req.query.lastname === '') {
                const students = await Student.find({firstname: req.query.firstname});
                res.render('allusers', {students: students});
            } else {
                const students = await Student.find({firstname: req.query.firstname, lastname: req.query.lastname});
                res.render('allusers', {students: students});
            }
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

app.get('/search-tutors', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            if (req.query.firstname === '' && req.query.lastname === '') {
                const tutors = await Tutor.find();
                res.render('allusers', {tutors: tutors});
            } else if (req.query.firstname === '') {
                const tutors = await Tutor.find({lastname: req.query.lastname});
                res.render('allusers', {tutors: tutors});
            } else if (req.query.lastname === '') {
                const tutors = await Tutor.find({firstname: req.query.firstname});
                res.render('allusers', {tutors: tutors});
            } else {
                const tutors = await Tutor.find({firstname: req.query.firstname, lastname: req.query.lastname});
                res.render('allusers', {tutors: tutors});
            }
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

app.listen(process.env.PORT);
