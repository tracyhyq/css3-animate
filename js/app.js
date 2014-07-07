define([
	'jquery',
	'./lib/then',
	'./template',
	'./audio'
], function($, then, tpl, audio){
	'use strict'

	var Page = {
		run: function(){
			var me = Page;
			me._init();
		},
		_init: function(){
			var me = Page;
			me.jqWordItem = null;
			me.dataCount = tpl.getJsonCount();
			me.ids = tpl.getIds();
			me.currentIndex = 1;
			me.running = false;    //处理多次点击
			me.answerClick = false;
			me.render();
			me._initEvent();
		},
		_initEvent: function(){
			var me = Page;
			$('.word-item .notice').on('click', function(e){
				me._handlerNoticeClick($(e.currentTarget));
			});
			$('.word-item .back-btn').on('click', function(e){
				me._handlerBackClick($(e.currentTarget));
			});
			$('.nav .pre-btn').click(function(e){
				me._hanlderPre($(e.currentTarget));
			});
			$('.nav .next-btn').click(function(e){
				me._hanlderNext($(e.currentTarget));
			});
			$('.nav-list').on('click', 'li', function(e){
				me._handlerLiClick($(this));
			});
			$('.play-audio').on('click', function(e){
				me._playAudio($(e.currentTarget));
			});
			$('.word-answer').on('click', function(e){
				me._judgeResult($(e.currentTarget));
			});
			audio.getAudio().addEventListener('ended', function(){
				$('.play-audio').removeClass('playing');
			}, false);
			audio.getAudio().addEventListener('playing', function(){
				$('.play-audio').addClass('playing');
			}, false);
		},
		_initImgAnimate: function(){
			var me = Page,
				jqWordBigImg = me.jqWordItem.find('.word-big-img'),
				jqImgEl = me.jqWordItem.find('.word-big-img .img-el');
			
			if(me.running) return;
			me.running = true;

			then(function(defer){
				jqWordBigImg.addClass('img-animate');
				defer();
			})
			.then(function(defer){
				jqImgEl.addClass('scale-img');
				defer();
			})
			.then(function(defer){
				if(jqImgEl[0].complete){
					setTimeout(function(){
						jqImgEl.removeClass('scale-img');
						defer();
					}, 2500);
				}else {
					jqImgEl.load(function(){
						setTimeout(function(){
							jqImgEl.removeClass('scale-img');
							defer();
						}, 2500);
					});
				}
			})
			.then(function(defer){
				jqWordBigImg.removeClass('img-animate');
				defer();
			})
			.then(function(defer){
				audio.playSetence(me.ids[me.currentIndex]);
				me.running = false;
				me.answerClick = false;
			});
		},
		render: function(){
			var me = Page;
			$('.words-list').html(tpl.json2html());
			$('.nav-list').html(tpl.renderNav());
			audio.playWord(me.ids[me.currentIndex]);
		},
		_handlerNoticeClick: function(tar){
			var me = Page,
				id = tar.data('id');

			me.jqWordItem = $('#word-item-' + id);
			$('.nav').hide();

			then(function(defer){
				me.jqWordItem.find('.word-details').addClass('word-details-show');
				defer();
			})
			.then(function(defer){
				setTimeout(function(){
					me._initImgAnimate();
				}, 1500);
			});
		},
		_handlerBackClick: function(tar){
			var me = Page,
				id = tar.data('id');

			me.jqWordItem = $('#word-item-' + id);
			me.jqWordItem.find('.word-details').removeClass('word-details-show');
			$('.nav').show();
		},
		_hanlderPre: function(tar){
			var me = Page,
				index = me.currentIndex <= 1 ? 1 : me.currentIndex;

			if(me.running) return;
			me.running = true;
			then(function(defer){
				if(me.currentIndex == 1){
					tar.addClass('disable-pre-btn');
					me.running = false;
					me.answerClick = false;
					alert('这是第一题了哦');
					return false;
				}

				me.currentIndex = me.currentIndex <= 1 ? 1 : me.currentIndex - 1;

				me.clearResult();
				tar.removeClass('disable-pre-btn');
				$('.next-btn').removeClass('disable-next-btn');
				$('.words-list .word-item-show').removeClass('word-item-show');
				$('#word-item-' + me.ids[index]).removeClass('word-item-hide');
				$('#word-item-' + me.ids[me.currentIndex]).addClass('word-item-show');
				$('.active').removeClass('active');
				$('.nav-dot-' + me.currentIndex).addClass('active');
				audio.playWord(me.ids[me.currentIndex]);
				defer();
			})
			.then(function(defer){
				setTimeout(function(){
					me.running = false;
				}, 500);
			});
			
		},	
		_hanlderNext: function(tar){
			var me = Page;

			if(me.running) return;
			me.running = true;

			then(function(defer){
				if(me.currentIndex == me.dataCount){
					tar.addClass('disable-next-btn');
					me.running = false;
					me.answerClick = false;
					alert('这是最后一题了哦');
					return;
				}

				me.currentIndex = me.currentIndex >= me.dataCount ? me.dataCount : me.currentIndex + 1;

				me.clearResult();
				tar.removeClass('disable-next-btn');
				$('.pre-btn').removeClass('disable-pre-btn');
				$('.words-list .word-item-show').removeClass('word-item-show').addClass('word-item-hide');
				$('#word-item-' + me.ids[me.currentIndex]).addClass('word-item-show');
				$('.active').removeClass('active');
				$('.nav-dot-' + me.currentIndex).addClass('active');
				audio.playWord(me.ids[me.currentIndex]);
				defer();
			})
			.then(function(defer){
				setTimeout(function(){
					me.running = false;
					me.answerClick = false;
				}, 500);
			})
		},
		_changeStatus: function(){
			var me = Page;

			switch(me.currentIndex) {
				case 1:
					$('.pre-btn').addClass('disable-pre-btn');
					$('.next-btn').removeClass('disable-next-btn');
					break;
				case me.dataCount:
					$('.next-btn').addClass('disable-next-btn');
					$('.pre-btn').removeClass('disable-pre-btn');
					break;
				default:
					$('.pre-btn').removeClass('disable-pre-btn');
					$('.next-btn').removeClass('disable-next-btn');

			}
		},
		_handlerLiClick: function(tar){
			var me = Page,
				id = tar.data('id'),
				index = tar.data('index');

			if(me.currentIndex < index){
				$('#word-item-' + me.ids[me.currentIndex]).addClass('word-item-hide').removeClass('word-item-show');
				$('#word-item-' + me.ids[index]).addClass('word-item-show');
			}else if(me.currentIndex > index){
				$('#word-item-' + me.ids[me.currentIndex]).removeClass('word-item-hide').removeClass('word-item-show');
				$('#word-item-' + me.ids[index]).addClass('word-item-show').addClass('word-item-hide');
			}
			me.currentIndex = index;
			me._changeStatus();
			me.clearResult();

			$('.active').removeClass('active');
			tar.addClass('active');
			audio.playWord(me.ids[me.currentIndex]);	
		},
		_playAudio: function(tar){
			var me = Page,
				id = tar.data('id'),
				type = tar.data('type');

			tar.addClass('playing');
			type == 'word' ? audio.playWord(id) : audio.playSetence(id);
		},
		_judgeResult: function(tar){
			var me = Page,
				id = tar.data('id');

			if(me.answerClick) return;
			me.answerClick = true;

			me.jqWordItem = $('#word-item-' + me.ids[me.currentIndex]);
			if(id == me.ids[me.currentIndex]){
				tar.find('.result').removeClass('wrong').addClass('right');
				setTimeout(function(){
					me._hanlderNext($('.nav .next-btn'));
				}, 1000);
			}else{
				tar.find('.result').removeClass('right').addClass('wrong');
				setTimeout(function(){
					$('.nav').hide();

					then(function(defer){
						me.jqWordItem.find('.word-details').addClass('word-details-show');
						defer();
					})
					.then(function(defer){
						setTimeout(function(){
							me._initImgAnimate();
						}, 1500);
					});
				}, 800);
			}
		},
		clearResult: function(){
			var me = Page;
			$('.word-item .result').removeClass('wrong').removeClass('right');
		}
	};

	return {
		init: Page.run
	}
});