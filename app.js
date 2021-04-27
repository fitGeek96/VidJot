//jshint esversion:6

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const {
    allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');

// initialize our Application
const app = express(); 

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


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



// Handlebars Middleware 
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json()); 
app.use(express.urlencoded({
    extended: false
}));

// Method override middlware 
app.use(express.static(path.join(__dirname, 'public')));

// Method override midleware
app.use(methodOverride('_method'));

// Express Session Midlleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect Falsh Middleware
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

});

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


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});