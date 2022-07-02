/*------------------------------------------------------------------------------------
    
JS INDEX
=============

01 - Main Slider JS
02 - Choosen Select JS
03 - Featured Slider JS
04 - Amenities Slider JS
05 - Testimonial Slider JS
06 - Single Property Slider JS
07 - Responsive Menu JS
08 - Tooltip JS
09 - Back to Top JS
10 - Page Loader JS




-------------------------------------------------------------------------------------*/


(function ($) {
	"use strict";

	jQuery(document).ready(function ($) {


		/* 
		=================================================================
		01 - Main Slider JS
		=================================================================	
		*/

		$(".asiq-slide").owlCarousel({
			animateOut: 'fadeOutLeft',
			animateIn: 'fadeIn',
			items: 1,
			nav: false,
			dots: true,
			autoplayTimeout: 7000,
			autoplaySpeed: 2000,
			autoplay: true,
			loop: true,
			navText: ["<i class='fa fa-long-arrow-left'><i>", "<i class='fa fa-long-arrow-right'><i>"],
			mouseDrag: true,
			touchDrag: true,
			responsive: {
				0: {
					items: 1
				},
				480: {
					items: 1
				},
				600: {
					items: 1
				},
				750: {
					items: 1
				},
				1000: {
					items: 1
				},
				1200: {
					items: 1
				}
			}
		});

		$(".asiq-slide").on("translate.owl.carousel", function () {
			$(".asiq-main-slide h2, .asiq-main-slide p").removeClass("animated fadeInUp").css("opacity", "0");
			$(".asiq-main-slide .asiq-btn").removeClass("animated fadeInDown").css("opacity", "0");
		});
		$(".asiq-slide").on("translated.owl.carousel", function () {
			$(".asiq-main-slide h2, .asiq-main-slide p").addClass("animated fadeInUp").css("opacity", "1");
			$(".asiq-main-slide .asiq-btn").addClass("animated fadeInDown").css("opacity", "1");
		});


		/* 
		=================================================================
		02 - Choosen Select JS
		=================================================================	
		*/

		$(".chosen-select-no-single").chosen({
			disable_search_threshold: 10,
		});

		/* 
		=================================================================
		03 - Featured Slider JS
		=================================================================	
		*/

		$(".featured-property-slide").owlCarousel({
			autoplay: true,
			loop: true,
			margin: 20,
			touchDrag: true,
			mouseDrag: true,
			items: 1,
			nav: true,
			dots: false,
			autoplayTimeout: 6000,
			autoplaySpeed: 1200,
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
			responsive: {
				0: {
					items: 1
				},
				480: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				},
				1200: {
					items: 3
				}
			}
		});


		/* 
		=================================================================
		04 - Amenities Slider JS
		=================================================================	
		*/

		$(".amenities-slide").owlCarousel({
			autoplay: true,
			loop: true,
			margin: 20,
			touchDrag: true,
			mouseDrag: true,
			items: 1,
			nav: true,
			dots: false,
			autoplayTimeout: 6000,
			autoplaySpeed: 1200,
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
			responsive: {
				0: {
					items: 1
				},
				480: {
					items: 1
				},
				600: {
					items: 1
				},
				1000: {
					items: 1
				},
				1200: {
					items: 1
				}
			}
		});


		/* 
		=================================================================
		05 - Testimonial Slider JS
		=================================================================	
		*/

		$(".testimonial-slide").owlCarousel({
			autoplay: true,
			loop: true,
			margin: 20,
			touchDrag: true,
			mouseDrag: true,
			items: 1,
			nav: false,
			dots: true,
			autoplayTimeout: 6000,
			autoplaySpeed: 1200,
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
			responsive: {
				0: {
					items: 1
				},
				480: {
					items: 1
				},
				600: {
					items: 1
				},
				1000: {
					items: 2
				},
				1200: {
					items: 2
				}
			}
		});

		/* 
		=================================================================
		06 - Single Property Slider JS
		=================================================================	
		*/


		var sync1 = $("#sync1");
		var sync2 = $("#sync2");
		var slidesPerPage = 4; //globaly define number of elements per page
		var syncedSecondary = true;

		sync1.owlCarousel({
			items: 1,
			slideSpeed: 2000,
			nav: true,
			autoplay: true,
			dots: true,
			loop: true,
			responsiveRefreshRate: 200,
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
		}).on('changed.owl.carousel', syncPosition);

		sync2
			.on('initialized.owl.carousel', function () {
				sync2.find(".owl-item").eq(0).addClass("current");
			})
			.owlCarousel({
				items: slidesPerPage,
				dots: true,
				nav: true,
				smartSpeed: 500,
				slideSpeed: 800,
				margin: 20,
				slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
				responsiveRefreshRate: 100
			}).on('changed.owl.carousel', syncPosition2);

		function syncPosition(el) {
			//if you set loop to false, you have to restore this next line
			//var current = el.item.index;

			//if you disable loop you have to comment this block
			var count = el.item.count - 1;
			var current = Math.round(el.item.index - (el.item.count / 2) - .5);

			if (current < 0) {
				current = count;
			}
			if (current > count) {
				current = 0;
			}

			//end block

			sync2
				.find(".owl-item")
				.removeClass("current")
				.eq(current)
				.addClass("current");
			var onscreen = sync2.find('.owl-item.active').length - 1;
			var start = sync2.find('.owl-item.active').first().index();
			var end = sync2.find('.owl-item.active').last().index();

			if (current > end) {
				sync2.data('owl.carousel').to(current, 100, true);
			}
			if (current < start) {
				sync2.data('owl.carousel').to(current - onscreen, 100, true);
			}
		}

		function syncPosition2(el) {
			if (syncedSecondary) {
				var number = el.item.index;
				sync1.data('owl.carousel').to(number, 100, true);
			}
		}

		sync2.on("click", ".owl-item", function (e) {
			e.preventDefault();
			var number = $(this).index();
			sync1.data('owl.carousel').to(number, 300, true);
		});


		/* 
		=================================================================
		07 - Responsive Menu JS
		=================================================================	
		*/
		$("ul#asiq_navigation").slicknav({
			prependTo: ".asiq-responsive-menu"
		});


		/* 
		=================================================================
		08 - Tooltip JS
		=================================================================	
		*/

		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		})

		/* 
		=================================================================
		09 - Back to Top JS
		=================================================================	
		*/
		$(window).on('scroll', function () {
			($(this).scrollTop() > 300) ? $('.back-to-top').addClass('is-visible'): $('.back-to-top').removeClass('is-visible is-fade-out');
			if ($(this).scrollTop() > 1200) {
				$('.back-to-top').addClass('is-fade-out');
			}
		});

		$('.back-to-top').on('click', function (e) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: 0,
			}, 700);
		});

	});


	/*====  Window Load Function =====*/
	jQuery(window).on('load', function () {
		/* 
		=================================================================
		10 - Page Loader JS
		=================================================================	
		*/
		setTimeout(function () {
			$('body').addClass('loaded');
		}, 500);
	});


}(jQuery));

