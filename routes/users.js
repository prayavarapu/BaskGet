

var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require("mongoose");
var LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = Promise;


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

	 console.log("titlelist" + titleList);

	 res.render('list', {"title": titleList});
	 
	 

})


//adding content within the list
router.post("/lists", function(req, res){

	var lstTitle = req.body.title;
	var productType = req.body.productType;
	var productTag = req.body.productTag;
	var url = req.body.url;

	var newContent = new Content({
		productType: productType,
		productTag: productTag,
		url: url
	})

	var newList = new List({
		title: lstTitle,
		content: newContent
	})

	
	List.findOne({title: lstTitle}, function(err, found){
		if(err){
			console.log("error: " + err);
		}
		if(found){
			console.log("found it! " + found);
			var found_title = found.title;
			updateContent(found_title, newContent);

		}
		else{
			newList.save(function(err, result){
				if(err){
					console.log(err);

				}
				else{
					found_title = result.title;
					console.log("this is the doc id " + found_title);
						updateContent(found_title, newContent);
						}
					});
					
				}
			})
		

	var updateContent = function(listTitle, content){
	newContent.save(function(err, content){
		if (err){
			console.log(err);
		}
		else{
			List.findOneAndUpdate({"title": listTitle}, {$push: {"content": content} }, {new: true}, function(err, newdoc){

				if(err){
					console.log(err);
				}
				else{
					res.send(content);
				}
			})
		}
	})
//update content function ending
	};

//end of the .post method
});

//getting all the content within the list
router.get("/lists/all/:title", function(req, res, next){
	var titleList = req.params.title;
	console.log(titleList);
	 List.find({"title": titleList}, function(err, found){
	 	})
	  		.populate("content")
	 		.exec(function(error, data){ 
	 			if (error){
	 				res.send("error has occurred ");
	 			}
	 			else{
	 				res.json(data);
	 			}
	 		})
	
	
		})




module.exports = router;


