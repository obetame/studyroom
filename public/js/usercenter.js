$(function(){
	//设置messenger
	Messenger.options = {
		extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
		theme: 'flat'
	}

	var $outPosition = $("#outPosition");
	var $addTime = $("#addTime");
	var $operation = $("input[name='operation']");

	/** 点击操作input事件 */
	$operation.click(function(event) {
		var IsoutPosition = $(this).data('outposition');

		if(IsoutPosition === 'yes'){
			//已经离座
			$outPosition.attr('disabled','disabled');
			$addTime.attr('disabled','disabled');
		}
		else{
			$outPosition.removeAttr('disabled');
			$addTime.removeAttr('disabled');
		}
	});

	/** 退座点击事件 */
	$outPosition.click(function(event) {
		//选择所有的选择元素，其实也就一个，如果没有被选中的就提示
		var $allCheck = $(":checked");

		if($allCheck.length!=0){
			//有选择的元素

			var roomNumber = $allCheck.data('roomnumber');
			var siteNumber = $allCheck.data('sitenumber');

			Messenger().run({
				errorMessage: "退座失败，请稍后重试...",
				// successMessage:'选座:'+select_site+'成功！',
				progressMessage:"正在退座中..."
			}, {
				url: "/usercenter",
				data:{
					roomNumber:roomNumber,
					siteNumber:siteNumber,
					operation:'outPosition',
				},
				type:'POST',
				success: function(data) {
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
						message: '退座:'+roomNumber+siteNumber+'成功！',
						type: 'success',
						hideAfter:5,
						showCloseButton: true
					});
				}
			});
		}
		else{
			Messenger().post({
				message: '未选择元素，请检查一下吧!',
				type: 'info',
				hideAfter:5,
				showCloseButton: true
			});
		}
	});

	/** 续时点击事件 */
	$addTime.click(function(event) {
		//选择所有的选择元素，其实也就一个，如果没有被选中的就提示
		var $allCheck = $(":checked");

		if($allCheck.length!=0){
			//有选择的元素
			
			var roomNumber = $allCheck.data('roomnumber');
			var siteNumber = $allCheck.data('sitenumber');

			Messenger().run({
				errorMessage: "续时失败，请稍后重试...",
				// successMessage:'选座:'+select_site+'成功！',
				progressMessage:"正在续时中..."
			}, {
				url: "/usercenter",
				data:{
					roomNumber:roomNumber,
					siteNumber:siteNumber,
					operation:'addTime',
				},
				type:'POST',
				success: function(data) {
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
						message: '续时:'+roomNumber+siteNumber+'成功！离座时间为：'+data.outTime+'。',
						type: 'success',
						hideAfter:5,
						showCloseButton: true
					});
				}
			});
		}
		else{
			Messenger().post({
				message: '未选择元素，请检查一下吧!',
				type: 'info',
				hideAfter:5,
				showCloseButton: true
			});
		}
	});
})