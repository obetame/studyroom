var async = require('async');
var users = require('./models/user');//user用户模型,定义了用户属性
var position = require('./models/position');//user用户模型,定义了用户属性
var moment = require('moment');//时间控制
moment.locale('zh-cn');//设置中文显示

/**
 * 登陆信息检测
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.login = function(req,res){
	async.waterfall([
		function(callback){
			users.findOne({
				userID:req.body.userID
			}
			,function(err,user){
				callback(null,user)
			})
		},
		function(user,callback){
			if(!user){
				//未找到用户userID
				res.render("login",{message:4});
				callback('user');
			}
			else{
				//有用户ID再判断密码
				users.findOne({
					userID:req.body.userID,
					password:req.body.password
				}
				,function(err,result){
					callback(null,user,result)
				})
			}
		},
		function(user,result,callback){
			if(result){
				//全部正确
				//存储信息到session中
				req.session.userID = user.userID;
				req.session.realName = user.realName;
				if(req.param('skipSite')){
					//如果有跳转参数就跳转到相应的页面
					//此功能需要配合js实现
					res.redirect(303,req.param('skipSite'));
				}
				else{
					//没有的话就跳转到根页面
					res.redirect(303,'/');
				}
			}
			else{
				//密码不正确
				res.render("login",{message:12});
			}
			callback(null);
		}
	])
}

/**
 * 查找已经选择的座位
 * @param  {[type]} req        [description]
 * @param  {[type]} res        [description]
 * @param  {[type]} roomNumber [自习室号]
 * @return {[type]}            [description]
 */
exports.hiddenSites = function(req,res){
	//查找已经有人的座位
	var roomNumber = req.query.roomNumber ? req.query.roomNumber:'A';

	position.find({
		roomNumber:roomNumber,
		hidden:true
	},
	function(err,sites){
		res.render('select',{
			sites:sites,
			roomNumber:roomNumber,
			isUser:true,
			userID:req.session.userID,
			realName:req.session.realName,
		})
	})
}

/**
 * 进入用户中心的操作
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.usercenter = function(req,res){
	//查找第几页面记录
	var page = req.query.page ? req.query.page:'1';

	async.waterfall([
		//第一个函数查找坐过位置的总数
		function(callback){
			position
			.find({userID:req.session.userID})
			.count(function(err,sum){
				callback(null,sum);
			});
		},
		function(sum,callback){
			users.findOne({userID:req.session.userID,realName:req.session.realName}
				,function(err,user){
					callback(null,sum,user)
				})
		},
		function(sum,user,callback){
			position.find({userID:req.session.userID})
			.sort({'_id':-1})
			.skip((parseInt(page)-1)*8)
			.limit(8)
			.exec(function(err,sites){callback(null,sum,user,sites)})
		}],
		function(err,sum,user,sites){
			//格式化每个选座日期
			var siteIsArray = Boolean(Object.prototype.toString.call(sites) === "[object Array]");
			
			if(siteIsArray){
				for(var i = 0;i<sites.length;i++){
					sites[i].moment = moment(sites[i].selectTime).format('LLL');
				}
			}
			else{
				sites.moment = moment(sites.selectTime).format('LLL');
			}

			res.render('usercenter',{
				// nowpage:parseInt(page),
				// sum:sum,
				user:user,
				isUser:true,
				sites:sites,
				siteIsArray:siteIsArray,
				userID:req.session.userID,
				realName:req.session.realName,
				pageNumber:page,
			})
		})
}

/** 自动还原所以座位 */
exports.autoHideSite = function(){
	//找所有有人的位置
	position.find({hidden:true},function(err,sites){
		var siteIsArray = Boolean(Object.prototype.toString.call(sites) === "[object Array]");
		/** 如果是数组 */
		if(siteIsArray){
			for(var i=0;i<sites.length;i++){
				var oldtime = moment(sites[i].selectTime);
				var nowtime = moment(Date.now());
				var N = 0;

				if(nowtime.get('year')>oldtime.get('year')){
					N++;
				}
				if(nowtime.get('month')>oldtime.get('month')){
					N++;
				}
				if(nowtime.get('date')>oldtime.get('date')){
					N++;
				}
				if(nowtime.get('hour')-oldtime.get('hour')>=4){
					N++;
				}
				if(N>0 || nowtime.get('hour')-oldtime.get('hour')>=4){
					var conditions = {
							roomNumber:sites[i].roomNumber,
							siteNumber:sites[i].siteNumber,
							hidden:true,
						}
						,update={$set:{hidden:false,outSiteTime:Date.now()},$inc:{overTimeNumber:1}}
						,options={multi:true};
					position.update(conditions, update, options, function(err,site){});
				}
			}
		}
		/** 如果不是数组 */
		else{
			var oldtime = moment(sites.selectTime);
			var nowtime = moment(Date.now());
			var N = 0;
			if(nowtime.get('year')>oldtime.get('year')){
				N++;
			}
			if(nowtime.get('month')>oldtime.get('month')){
				N++;
			}
			if(nowtime.get('day')>oldtime.get('day')){
				N++;
			}
			if(nowtime.get('hour')-oldtime.get('hour')>=4){
				N++;
			}
			if(N>0 || nowtime.get('hour')-oldtime.get('hour')>=4){
				var conditions = {
						roomNumber:sites.roomNumber,
						siteNumber:sites.siteNumber,
						hidden:true,
					}
					,update={$set:{hidden:false,outSiteTime:Date.now()},$inc:{overTimeNumber:1}}
					,options={multi:true};
				position.update(conditions, update, options, function(err,site){console.log(site.outSiteTime)});
			}
		}
	});
}