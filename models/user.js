var mongoose = require('mongoose');

//用户模型
var user = mongoose.Schema({
	userID:{type:String,index:1,unique:true},//学号
	password:String,
	createTime:{type:Date,default:Date.now()},
	gender:String,//性别
	email:String,
	realName:String,//姓名
	college:String,//所属学院
	profession:String,//所属专业
	grade:String,//年级
	collect:[String],
	like:Number,//赞数
	nolike:Number,//不喜欢
	overTimeNumber:Number,//超时次数
});


var users = mongoose.model('users',user);
module.exports = users;