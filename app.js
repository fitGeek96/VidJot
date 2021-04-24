//jshint esversion:6
require('./models/Idea');

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express(); // initialize our Application


// Map global promise - get rid of warning 
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('MongoDB Connected .... ');
    })
    .catch(err => console.log(err));

// Load Idea Model
const Idea = mongoose.model('ideas');

// Handlebars Middleware 
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

// Add Idea From
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process Form 
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details'
        });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then( idea => {
            res.redirect('/ideas');
        });
    }
});

// Index Route
app.get('/about', (req, res) => {
    res.render('about');
});








const port = 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});