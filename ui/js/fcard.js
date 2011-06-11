;!function(ctx){
	
	head.js(
	"js/vendor/move.min.js"
	, "js/vendor/jquery.min.js"
	, "js/vendor/underscore.min.js"
	, function() {

		var m = move;

		m.select = function(selector) {
			return jQuery(selector).get(0);
		};

		m.defaults = {
			duration: 500
		};

		$('a.next').click(function(){

			m('.question')
				.set('height', '50%')
			.end();

		});

		$('a.previous').click(function(){

			m('.question')
				.set('height', '100%')
			.end();

		});

	});
		
}(this);