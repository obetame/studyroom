var express = require('express');
var router = express.Router();

var datafind = require('../datafind');
var position = require('../models/position');//user用户模型,定义了用户属性

var users = require('../models/user');//user用户模型,定义了用户属性
var position = require('../models/position');//user用户模型,

var moment = require('moment');//时间控制
var async = require('async');//逻辑控制

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.session.userID){
		datafind.usercenter(req,res);
	}
	else{
		res.redirect(303,'/login?skipSite=usercenter');
	}
});

router.post('/',function(req,res){
	//判断是否是post方式提交
	if(req.xhr){
		//判断是否是登陆用户提交
		if(req.session.userID){
			//首先判断座位是否已经被选
			async.waterfall([
				function(callback){
					position.findOne({
						roomNumber:req.body.roomNumber,
						siteNumber:req.body.siteNumber,
						userID:req.session.userID,
						hidden:true,
					},function(err,site){callback(null,site)})
				},
				function(site,callback){
					if(site){
						//座位已经选择，可以操作
						
						if(req.body.operation=='outPosition'){
							//离座操作
							var conditions = {
									roomNumber:req.body.roomNumber,
									siteNumber:req.body.siteNumber,
									userID:req.session.userID,
									hidden:true,
								}
								,update={$set:{hidden:false,outSiteTime:Date.now()}}
								,options={multi:true};
							position.update(conditions, update, options, function(err,numaffected){
									//没有错误
									res.send({error:false});
								});
						}
						else{
							//续时操作
							var conditions = {
									roomNumber:req.body.roomNumber,
									siteNumber:req.body.siteNumber,
									userID:req.session.userID,
									hidden:true,
								}
								,update={$set:{selectTime:Date.now()}}
								,options={multi:true};
							position.update(conditions, update, options, function(err,numaffected){
									//没有错误
									res.send({error:false,outTime:moment(new Date()).format('LLL')});
								});
						}
					}
					else{
						//错误，没有找到位置
						//防止有人故意操作js
						res.send({error:true});
					}
				}
				])
		}
	}
});



module.exports = router;