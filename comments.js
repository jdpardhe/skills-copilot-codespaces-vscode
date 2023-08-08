// Create web server
var express = require('express');
var router = express.Router();

// Create a reference to the database
var firebase = require('firebase');
var db = firebase.database();

// Create a reference to the comments collection
var commentsRef = db.ref('comments');

// GET handler for /comments
router.get('/', function(req, res, next) {
    var comments = [];
    commentsRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var comment = childSnapshot.val();
            comment.key = childSnapshot.key;
            comments.push(comment);
        });
        res.render('comments', { title: 'Comments', comments: comments });
    });
});

// POST handler for /comments
router.post('/', function(req, res, next) {
    // Get the comment from the request body
    var comment = req.body.comment;

    // Add the comment to the database
    commentsRef.push(comment);

    // Redirect to /comments
    res.redirect('/comments');
});

// GET handler for /comments/delete/:key
router.get('/delete/:key', function(req, res, next) {
    // Get the key from the URL
    var key = req.params.key;

    // Delete the comment from the database
    commentsRef.child(key).remove();

    // Redirect to /comments
    res.redirect('/comments');
});

module.exports = router;