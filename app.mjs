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
import bcrypt from 'bcryptjs';

const app = express();

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
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
        // hash passwords
        const password = req.body.password;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        if (req.body.role === 'tutor') {
            const tutor = new Tutor({firstname, lastname, username, password: hash});
            await tutor.save();
        } else if (req.body.role === 'student') {
            const student = new Student({firstname, lastname, username, password: hash});
            await student.save();
        } else if (req.body.role === 'admin') {
            const admin = new Admin({firstname, lastname, username, password: hash});
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
            const sessions = await Session.find();
            res.json(sessions);
        } else if (req.user.type === 'tutor') {
            const user = await Tutor.findById(req.user.id).exec();
            //const sessions3 = await Session.find({tutor: user}).exec();
            //console.log('sessions', sessions3);
            const sessions = [];
            const allSessions = await Session.find();
            for (const session of allSessions) {
                if (session.tutor?._id.toString() == user._id.toString()) {
                    sessions.push(session);
                }
            }
            res.json({sessions: sessions, user: user});
        } else {
            res.status(401).json({ error: 'User not authorized' });
        
        }
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

app.post('/api/sessions/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (req.user.type === 'admin') {
        const session = await Session.findById(req.params.id).exec();
        const tutor = await Tutor.findById(req.body.tutor).exec();
        if (!session || !tutor) {
            return res.status(404).json({ error: 'Session or tutor not found' });
        }
        session.tutor = tutor;
        await session.save();
        return res.json(session);
    } 
    
    if (req.user.type === 'tutor') {
        const user = await Tutor.findById(req.user.id).exec();
        const session = await Session.findById(req.params.id).exec();
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        if (session.tutor._id.toString() === user._id.toString()) {
            if (req.body.status === 'in progress' || req.body.status === 'completed') {
                session.status = req.body.status;
                const date = new Date();
                const estTime = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
                const time = estTime.split(",")[1].split(":").join(":").trim();
                session.start = time;
                await session.save();
                return res.json(session);
            }
        } else {
            return res.status(401).json({ error: 'User not authorized' });
        }
    }
    return res.status(401).json({ error: 'User not authorized' });
});

app.delete('/api/sessions/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            await Session.deleteOne({_id: req.params.id});
            res.status(204).end();
        } else if (req.user.type === 'tutor') {
            const user = await Tutor.findById(req.user.id).exec();
            const session = await Session.findById(req.params.id).exec();
            if (session.tutor._id.toString() === user._id.toString()) {
                await Session.deleteOne({_id: req.params.id});
                res.status(204).end();
            } else {
                res.status(401).json({ error: 'User not authorized' });
            }
        } else if (req.user.type === 'student') {
            const user = await Student.findById(req.user.id).exec();
            const session = await Session.findById(req.params.id).exec();
            if (session.students[0]._id.toString() === user._id.toString()){
                await Session.deleteOne({_id: req.params.id});
                res.status(204).end();
            } else {
                res.status(401).json({ error: 'User not authorized' });
            }
        
        } else {
            res.status(401).json({ error: 'User not authorized' });
        }
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

app.get('/api/tutors', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            const tutors = await Tutor.find();
            res.json(tutors);
        } else {
            res.status(401).json({ error: 'User not authorized' });

        }
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

app.get('/api/courses', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            const courses = await Course.find();
            res.json(courses);
        } else if (req.user.type === 'tutor') {
            const courses = await Course.find();
            res.json(courses);
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
    const time = estTime.split(",")[1].split(":").join(":");
    const newSession = new Session({tutor: null, students: [user], course: course, start: time, end: null, location: null, status: 'pending', evaluation: null});
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

app.post('/edit/:id' , async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    if (req.user.type !== 'admin' && req.user.type !== 'tutor') {
        return res.status(401).json({ error: 'User not authorized' });
    }
    try {
        const session = await Session.findById(req.params.id).exec();
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        if (req.user.type === 'tutor') {
            const user = await Tutor.findById(req.user.id).exec();
            if (!session.tutor.equals(user._id)) {
                return res.status(401).json({ error: 'User not authorized' });
            }
            if (req.body.start) {
                const date = new Date(req.body.start);
                const estTime = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
                const time = estTime.split(",")[1].split(":").join(":");
                console.log(time);
                session.start = time;
            }
        }

        if (req.user.type === 'admin') {
            const tutor = await Tutor.findById(req.body.tutor).exec();
            if (!tutor) {
                return res.status(404).json({ error: 'Tutor not found' });
            }
            session.tutor = tutor;

        }
        session.location = req.body.location || session.location;
        session.course = req.body.course ? await Course.findOne({ _id: req.body.course }) : session.course; 

        await session.save();
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/end/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    if (req.user.type !== 'tutor') {
        return res.status(401).json({ error: 'User not authorized' });
    }
    try {
        const session = await Session.findById(req.params.id).exec();
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        if (req.user.type === 'tutor') {
            const user = await Tutor.findById(req.user.id).exec();
            if (!session.tutor.equals(user._id)) {
                return res.status(401).json({ error: 'User not authorized' });
            }
        }
        session.status = 'completed';
        if (!req.body.end) {
            const date = new Date();
            const estTime = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
            const time = estTime.split(",")[1].split(":").join(":");
            session.end = time;
        } else {
            const time = req.body.end.split(',')[1];
            session.end = time;
        }
        if (req.body.start) {
            const time = req.body.start.split(',')[1];
            session.start = time;
        }
        const evaluation = {};
        evaluation.prepared = req.body.prepared;
        evaluation.content = req.body.content;
        evaluation.notes = req.body.notes;
        session.evaluation = evaluation;
        await session.save();
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/completed', async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') {
            const sessions = await Session.find({status: 'completed'});
            const user = await Admin.findById(req.user.id).exec();
            res.render('completed', {sessions: sessions, user: user});
        } else if (req.user.type === 'tutor') {
            const user = await Tutor.findById(req.user.id).exec();
            const sessions = await Session.find({tutor: user, status: 'completed'});
            res.render('completed', {sessions: sessions, user: user, type: 'tutor'});
        
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});


app.listen(process.env.PORT);
