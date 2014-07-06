define([
	'../data/json'
], function(data){
	'use strict'

	var Template = function(){},
		proto = Template.prototype;

	proto.json2html = function(){
		var length = data.length,
			html = '',
			len = 0,
			i, j, temp, randomTemp;

		if(!length) return '';
		for(i = 0; i < length; i++){
			temp = data[i];
			html += 
				'<li data-index="' + (i + 1) + '" class="word-item ' + (i == 0 ? "word-item-show" : "") + '" id="word-item-' + temp.id + '">'
				+ 	'<div class="word-text-wrap">'
				+ 		'<span class="word-text">' + temp.word + '</span>'
				+		'<span class="word-phonetic">' + temp.accent + '</span>'
				+		'<span class="play-audio play" data-type="word" data-id="' + temp.id + '"></span>'
				+	'</div>'
				+	'<div class="answer-wrap">'
				+		'<ul class="answer-list">';

			for(j = 0, len = temp.random_group_words.length; j < len; j++){
				randomTemp = temp.random_group_words[j];
				html += '<li data-id="' + randomTemp.id + '" class="word-answer">'
					+		'<span class="order">' + (j + 1) + '</span>'
					+		'<img src="' + randomTemp.thumbnail_image + '">'
					+		'<span class="result"></span>'
					+	'</li>';
			}
			
			html += '</ul>'
				+	'<a href="javascript:;" class="notice" data-id="' + temp.id + '">给点儿提示</a>'
				+ '</div>'
				+ '<div class="word-details">'
				+ 	'<table class="detail-table">'
				+		'<tbody>'
				+			'<tr>'
				+				'<td class="title"><span class="title-block">意思:</span></td>'	
				+				'<td class="value"><label>' + temp.mean_cn + '</label></td>'
				+			'</tr>'
				+			'<tr>'
				+				'<td class="title"><span class="title-block">例句:</span></td>'
				+				'<td class="value"><label class="sentence">' + temp.sentence + '</label><span class="play-audio play" data-type="setence" data-id="' + temp.id + '"></span></td>'
				+			'</tr>'		
				+			'<tr>'
				+				'<td class="title"><span class="title-block">例句翻译:</span></td>'
				+				'<td class="value">'
				+					'<label>' + temp.sentence_trans + '</label>'
				+					'<a class="link-trans-comment" href="#sentence-trans-comment-wrapper">翻译报错</a>'
				+				'</td>'
				+			'</tr>'
				+			'<tr>'
				+				'<td class="title"><span class="title-block">短句:</span></td>'
				+				'<td class="value"><label>' + temp.short_phrase + '</label></td>'	
				+			'</tr>'
				+			'<tr>'
				+				'<td class="title"><span class="title-block">词根:</span></td>'
				+				'<td class="value"><label>' + temp.etyma + '</label></td>'	
				+			'</tr>'
				+		'</tbody>'
				+	'</table>'
				+	'<a class="back-btn" data-id="' + temp.id + '">继续做题</a>'
				+	'<div class="word-big-img">'
				+		'<div class="img-bg "></div>'
				+		'<img class="img-el" src="' + temp.image_file + '">'
				+	'</div>'
				+ '</div>'
				+'</li>';
		}
		return html;
	};

	proto.renderNav = function(){
		var length = data.length,
			html = '',
			left = 0,
			temp,
			i;

		if(!length) return '';
		for(i = 0; i < length; i++){
			temp = data[i];
			left = Math.floor((630 / (length - 1)) * (i) / 630 * 100) ;
			html += '<li class="nav-dot-' + (i + 1) + ' ' + (i == 0 ? "active" : "")+ '" data-index="' + (i + 1) + '" style="left:' + left + '%" data-id="' + temp.id + '">'
				+ '<a href="javascript:;" data-id="' + temp.id +'">' + temp.word + '</a>'
				+ '</li>';
		}

		return html;
	};

	proto.getJsonCount = function(){
		return data.length;
	};

	proto.getIds = function(){
		var map = {},
			length = data.length,
			i;

		for(i = 0; i < length; i++){
			map[i + 1] = data[i].id;
		}

		return map;
	};

	return new Template();
});