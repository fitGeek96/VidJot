//jshint esversion:6
require('./models/Idea');

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


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
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({
    extended: false
})); 
 

// Method override midleware
app.use(methodOverride('_method'));


// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});


// Index Route
app.get('/about', (req, res) => {
    res.render('about');
});


// Add Idea From
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea From
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
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
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            });
    }
});

// Idea index Page 
app.get('/ideas', (req, res) => {
    Idea
        .find({})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea => {
            res.redirect('/ideas');
        });
    });
});

// Delete Idea 
app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({
        _id: req.params.id
    }).then(() => {
        res.redirect('/ideas');
    });
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});