

var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var List = require('../models/list');
var Content = require('../models/content');


// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});


// Get list page
router.get('/lists/:title', function(req, res){
	 var titleList = req.params.title;
	console.log(titleList);


res.render('list', {title: titleList});
});

	//adding list to database
// 	router.post('/lists/:title', function(req, res){
// 		console.log("hello this is from the post method: " + titleList);
// 		var newList = new List({
// 			title: titleList
// 		})

// 		newList.save(function(error, doc){
// 			if (error){
// 				console.log(error);
// 			}
// 			else{
// 				console.log(doc);
// 			}
// 	})
// })



//creating example list and putting content within it

var exampleList = new List({
	name: "Fashion"
});

exampleList.save(function(error, doc){
	if (error){
		console.log(error);

	}
	else{
		console.log(doc);
	}
});

//adding content within the list
router.post("/lists", function(req, res){
	var productType = req.body.productType;
	console.log(productType);
	var productTag = req.body.productTag;
	console.log(productTag);
	var url = req.body.url;
	 console.log("url: " + url);

	var newContent = new Content({
		productType: productType,
		productTag: productTag,
		url: url
	})

	newContent.save(function(err, doc){
		if (err){
			res.send(err);
		}
		else{
			List.findOneAndUpdate({}, {$push: {"content": doc._id} }, {new: true}, function(err, newdoc){

				if(err){
					res.send(err);
				}
				else{
					res.send(newdoc);
				}
			})
		}
	});

});



















module.exports = router;


