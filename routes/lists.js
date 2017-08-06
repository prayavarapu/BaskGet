var express = require('express');
var router = express.Router();

// Get list page
router.get('/lists', ensureAuthenticated, function(req, res){
	res.render('list');
});

module.exports = router;