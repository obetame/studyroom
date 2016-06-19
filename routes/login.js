var express = require('express');
var router = express.Router();

var datafind = require('../datafind');

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.session.userID){
		//如果已经登陆
		// datafind.user(req,res,'index');
		res.render('index',{
			isUser:true,
			userID:req.session.userID,
			realName:req.session.realName,
		});
	}
	else{
		res.render('login');
	}
});

router.post('/',function(req,res){
	datafind.login(req,res);
})

module.exports = router;
