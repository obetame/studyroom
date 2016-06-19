var express = require('express');
var router = express.Router();

var user = require('../models/user');//user用户模型,定义了用户属性

var datafind = require('../datafind');

/* GET register listing. */
router.get('/', function(req, res, next) {
	if(req.session.userID){
		// datafind.user(req,res,'index');
		res.render('index',{
			isUser:true,
			userID:req.session.userID,
			realName:req.session.realName,
		});
	}
	else{
		res.render('register');
	}
});


//register post data(处理注册页面post回的数据)
router.post('/',function(req,res){
	if(req.xhr){
		//注册邮箱、学号检测(晚点实现)
		// datafind.registerajax(req,res);
	}
	else{
		var newuser = new user({
			userID:req.body.userID,
			realName:req.body.realName,
			password:req.body.password,
			email:req.body.email,
			gender:parseInt(req.body.gender)?'1':'0',
			college:req.body.college,
			profession:req.body.profession,
			grade:req.body.grade,
			collect:[],
			like:0,
			nolike:0,
			overTimeNumber:0,
		});

		newuser.save(function(err,user){
			req.session.realName = user.realName;//用户信息存入session
			req.session.userID = user.userID;
			res.redirect(303,'./select');//注册成功
		});
}
});

module.exports = router;
