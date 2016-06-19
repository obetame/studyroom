var express = require('express');
var router = express.Router();

var datafind = require('../datafind');

/* GET home page. */
router.get('/', function(req, res, next) {
	setInterval(function(){
		datafind.autoHideSite();
	},1000*60);
	if(req.session.userID){
		// datafind.user(req,res,'index');
		res.render('index',{
			isUser:true,
			userID:req.session.userID,
			realName:req.session.realName,
		});
	}
	else{
		// res.redirect(303,'/');
		res.render('index');

	}
});

module.exports = router;
