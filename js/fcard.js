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
			duration: 900
		};

		$('a.next').click(function(){
			
			m('.card p')
				.set('left', 450)
				.end(function(){
					
				});

		});

	});
		
}(this);