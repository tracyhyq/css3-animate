require.config({
	paths: {
		'jquery': 'lib/jquery-1.11.1'
	}
});

require([
	'jquery',
	'app'
], function($, app){
	$(document).ready(function(){
		app.init();
	});
	
});