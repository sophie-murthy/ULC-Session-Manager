import mongoose from 'mongoose';

mongoose.connect(process.env.DSN);

const courseSchema = new mongoose.Schema({
    title: {required: true, type: String},
    professor: {required: false, type: String}
});

const tutorSchema = new mongoose.Schema({
    firstname: {required: true, type: String},
    lastname: {required: true, type: String},
    username: {required: true, type: String},
    password: {required: true, type: String},
    courses: [courseSchema],
    hours: {type: Array},
    //sessions: [sessionSchema]
});

const adminSchema = new mongoose.Schema({
    firstname: {required: true, type: String},
    lastname: {required: true, type: String},
    username: {required: true, type: String},
    password: {required: true, type: String}
});

const studentSchema = new mongoose.Schema({
    firstname: {required: true, type: String},
    lastname: {required: true, type: String},
    username: {required: true, type: String},
    password: {required: true, type: String},
    courses: [courseSchema],
    //sessions: [sessionSchema]
});

const sessionSchema = new mongoose.Schema({
    tutor: {type: tutorSchema},
    students: [studentSchema],
    course: {type: courseSchema},
    start: {type: String},
    end: {type: String},
    location: {type: String},
    status: {type: String},
    evaluation: {type: Object}
});

const Tutor = mongoose.model('Tutor', tutorSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Student = mongoose.model('Student', studentSchema);
const Session = mongoose.model('Session', sessionSchema);
const Course = mongoose.model('Course', courseSchema);

export { Tutor, Admin, Student, Session, Course };
