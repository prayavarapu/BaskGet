

var express = require('express');
var router = express.Router();

// Register route
router.get('/register', function(req, res){
	res.render('register');
});

// Login route
router.get('/login', function(req, res){
	res.render('login');
});

module.exports = router;