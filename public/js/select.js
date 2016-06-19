$(function() {
	var datas = {
		labels: [
			"大一",
			"大二",
			"大三",
			"大四",
		],
		datasets: [
			{
				data: [20,25,45,10],
				backgroundColor: [
					"#FF6384",
					"#36A2EB",
					"#4D5360",
					"#FFCE56"
				],
				hoverBackgroundColor: [
					"#949FB1",
					"#4D5360",
					"#FDB45C",
					"#949FB1",
				]
			}
		]
	};

	var config = {
		type: 'pie',
		data: datas,
		options: {
			responsive: false
		}
	};

	var ctx = document.getElementById("pie").getContext("2d");
	window.myPie = new Chart(ctx, config);

	// Flexslider
	$('.flexslider').flexslider({
		controlNav: false,
		directionNav: false
	});

});

//myself thing
$(function(){
	//定义变量以便速度更快
	var $submit_position = $(".submit-position");//提交按钮

	//设置messenger
	Messenger.options = {
		extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
		theme: 'flat'
	}

	/**
	 * 选择座位按钮点击事件
	 * @param  {[type]} event) {				var     $parent [description]
	 * @return {[type]}        [description]
	 */
	$('.js_a_check').click(function(event) {
		// 取得父元素和子元素
		var $parent = $(this).parent();
		var $children = $(this).children();

		//存储当前元素状态
		var self_state = $parent.hasClass('gray-bg');

		//清除所有的座位状态，恢复成灰色（会导致当前的状态成为灰色bug，所以需要记录存储当前值）
		var $js_a_check = $('.js_a_check');
		$js_a_check.parent().removeClass('green-bg').addClass('gray-bg');
		$js_a_check.children().removeClass('fa-check-square-o').addClass('fa-square-o');
		
		//判断父元素状态来改变
		if(self_state){
			$parent.removeClass('gray-bg').addClass('green-bg');
			$children.removeClass('fa-square-o').addClass('fa-check-square-o');
		}
		else{
			$parent.removeClass('green-bg').addClass('gray-bg');
			$children.removeClass('fa-check-square-o').addClass('fa-square-o');
		}
	});

	/**
	 * 收藏按钮的UI改变，稍后提供收藏功能
	 * @param  {[type]} event) {		var       $children [description]
	 * @return {[type]}        [description]
	 */
	$('.js-position-collect').click(function(event) {
		var $children = $(this).children('i');

		if($children.hasClass('fa-star')){
			//未收藏
			$children.removeClass('fa-star').addClass('fa-star-o');
		}
		else{
			//已经收藏
			$children.removeClass('fa-star-o').addClass('fa-star');
		}
	});

	/**
	 * 提交按钮点击事件
	 * @param  {[type]} event) {			}       [description]
	 * @return {[type]}        [description]
	 */
	$submit_position.click(function(event) {
		var $fa_square = $(".fa-check-square-o");//已经选好的元素，一个页面只能有一个选好的

		//首先检测页面中类fa-square是否只有一个
		if($fa_square.length===1){
			var select_site = $fa_square.data('select');
			var roomNumber = select_site.slice(0,1);
			var siteNumber = parseInt(select_site.slice(1));

			Messenger().run({
				errorMessage: "选座失败，请稍后重试...",
				// successMessage:'选座:'+select_site+'成功！',
				progressMessage:"正在选座中..."
			}, {
				url: "/select",
				data:{
					roomNumber:roomNumber,
					siteNumber:siteNumber,
				},
				type:'POST',
				success: function(data) {
					if(!data.hasSelect){
						if(data.error){
							Messenger().post({
								message: '服务器错误,请稍后重试！',
								type: 'info',
								hideAfter:5,
								showCloseButton: true
							});
							return;
						}
						Messenger().post({
							message: '选座:'+select_site+'成功！',
							type: 'success',
							hideAfter:5,
							showCloseButton: true
						});
					}
					else{
						Messenger().post({
							message: '你已经选择座位并且还未退座！',
							type: 'error',
							hideAfter:5,
							showCloseButton: true
						});
					}
				}
			});
		}
		else{
			Messenger().post({
				message: '请选择正确数量的座位(只能一个！)',
				type: 'error',
				hideAfter:5,
				showCloseButton: true
			});
		}
	});
})