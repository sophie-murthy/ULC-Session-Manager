import mongoose from 'mongoose';

mongoose.connect(process.env.DSN);

/*
const tutorSchema = new mongoose.Schema({
    firstname: {required: true, type: String},
    lastname: {required: true, type: String},
    username: {required: true, type: String},
    password: {required: true, type: String},
    courses: [courseSchema],
    hours: {type: Array}
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
    courses: [courseSchema]
});

const sessionSchema = new mongoose.Schema({
    tutor: {type: tutorSchema},
    students: [studentSchema],
    course: {type: courseSchema},
    start: {type: Date},
    end: {type: Date},
    location: {type: String},
    status: {type: String},
    evaluation: {type: Object}
});

const courseSchema = new mongoose.Schema({
    title: {required: true, type: String},
    professor: {required: false, type: String}
});


mongoose.model('Tutor', tutorSchema);
mongoose.model('Admin', adminSchema);
mongoose.model('Student', studentSchema);
mongoose.model('Session', sessionSchema);
mongoose.model('Course', courseSchema);

*/