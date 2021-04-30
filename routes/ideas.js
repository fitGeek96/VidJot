//jshint esversion:6

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAthenticated
} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Add Idea From
router.get('/add', ensureAthenticated, (req, res) => {
    res.render('ideas/add');
});

// Edit Idea From
router.get('/edit/:id', ensureAthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            console.log(idea.user);
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized to see others ideas');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        });
});

// Process Form 
router.post('/', ensureAthenticated, (req, res) => {
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
            details: req.body.details,
            user: req.user.id
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas');
            });
    }
});

// Idea index Page 
router.get('/', ensureAthenticated, (req, res) => {
    Idea
        .find({
            user: req.user.id
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// Edit Form process
router.put('/:id', ensureAthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save().then(idea => {
                req.flash('success_msg', 'Video Idea Updated');
                res.redirect('/ideas');
            });
        });
});

// Delete Idea 
router.delete('/:id', ensureAthenticated, (req, res) => {
    Idea.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Video Idea Removed');
        res.redirect('/ideas');
    });
});

module.exports = router;