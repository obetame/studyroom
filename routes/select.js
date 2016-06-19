var express = require('express');
var router = express.Router();

var datafind = require('../datafind');
var position = require('../models/position');//user用户模型,定义了用户属性

var moment = require('moment');//时间控制
var async = require('async');//逻辑控制

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.session.userID){
		datafind.hiddenSites(req,res);
	}
	else{
		res.redirect(303,'/login?skipSite=select');
	}
});

router.post('/',function(req,res){
	//判断是否是post方式提交
	if(req.xhr){
		//判断是否是登陆用户提交
		if(req.session.userID){
			//首先判断是否已经选择过座位
			async.waterfall([
				function(callback){
					position.findOne({
						userID:req.session.userID,
						hidden:true
					}
					,function(err,user){
						callback(null,user)
					})
				},
				function(user,callback){
					if(!user){
						//说明用户之前没有选择座位，可以继续选座
						callback(null,user);
					}
					else{
						res.send({hasSelect:true});
						callback('user');
					}
				},
				function(user,callback){
					//之前没有座位，则可以选座更新座位
					var addPosition = new position({
						roomNumber:req.body.roomNumber,
						siteNumber:req.body.siteNumber,
						userID:req.session.userID,
						username:req.session.realName,
						selectTime:Date.now(),
						hidden:true,
					});

					addPosition.save(function(err,position){
						if(err){
							res.send({error:true});
						}
						else{
							res.send({hasSelect:false});
						}
					});

					callback(null);
				}
				])
		}
	}
})

module.exports = router;
