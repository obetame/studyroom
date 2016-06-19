$(function() {

			$('#hotelCarTabs a').click(function (e) {
			  e.preventDefault()
			  $(this).tab('show')
			})

			$('.date').datetimepicker({
				format: 'MM/DD/YYYY'
			});
			$('.date-time').datetimepicker();

			// https://css-tricks.com/snippets/jquery/smooth-scrolling/
			$('a[href*=#]:not([href=#])').click(function() {
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				  var target = $(this.hash);
				  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				  if (target.length) {
					$('html,body').animate({
					  scrollTop: target.offset().top
					}, 1000);
					return false;
				  }
				}
			});
		});
		
		// Load Flexslider when everything is loaded.
		$(window).load(function() {	  		
			// Vimeo API nonsense

/*
			  var player = document.getElementById('player_1');
			  $f(player).addEvent('ready', ready);
			 
			  function addEvent(element, eventName, callback) {
				if (element.addEventListener) {
				  element.addEventListener(eventName, callback, false)
				} else {
				  element.attachEvent(eventName, callback, false);
				}
			  }
			 
			  function ready(player_id) {
				var froogaloop = $f(player_id);
				froogaloop.addEvent('play', function(data) {
				  $('.flexslider').flexslider("pause");
				});
				froogaloop.addEvent('pause', function(data) {
				  $('.flexslider').flexslider("play");
				});
			  }
*/

			 
			 
			  // Call fitVid before FlexSlider initializes, so the proper initial height can be retrieved.
/*

			  $(".flexslider")
				.fitVids()
				.flexslider({
				  animation: "slide",
				  useCSS: false,
				  animationLoop: false,
				  smoothHeight: true,
				  controlNav: false,
				  before: function(slider){
					$f(player).api('pause');
				  }
			  });
*/


			  

//	For images only
			$('.flexslider').flexslider({
				controlNav: false
			});


		});