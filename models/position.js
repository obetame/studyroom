var mongoose = require('mongoose');
var moment = require('moment');

//自习室每个位置的模型
var position = mongoose.Schema({
	roomNumber:{type:String},//自习室号
	siteNumber:{type:Number,index:1},//座位号
	userID:{type:String},
	username:{type:String,index:1},//座位同学用户名
	selectTime:{type:Date,default:Date.now()},//选座时间,默认为创建的时间
	outSiteTime:Date,//离开座位时间
	hidden:{type:Boolean,default:false},//是否隐藏，默认不隐藏，等退座后隐藏,true为有人
});

var positions = mongoose.model('positions',position);
module.exports = positions;