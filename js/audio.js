define([
	'../data/json'
], function(data){
	'use strict'

	var AudioFun = function(){},
		proto = AudioFun.prototype,
		audio = new Audio();

	var fetchUrl = function(id, type){
		var wordMp3 = '',
			len = data.length,
			i;

		for(i = 0; i < len; i++){
			if(data[i].id == id){
				wordMp3 = type == 'word' ? data[i].word_voice : data[i].audio_file;
				break;
			}
		}

		return wordMp3;
	};

	proto.playWord = function(id){
		audio.src = fetchUrl(id, 'word');
		audio.play();
	};

	proto.playSetence = function(id){
		audio.src = fetchUrl(id, 'setence');
		audio.play();
	};

	proto.getAudio = function(){
		return audio;
	};

	return new AudioFun();
});