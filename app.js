//jshint esversion:6
require('./models/Idea');

const express = require('express');
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

// Index Route
app.get('/about', (req, res) => {
    res.render('about');
});








const port = 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});