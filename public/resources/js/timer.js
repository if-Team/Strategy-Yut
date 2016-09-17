var Timer;
(function(){
	var left = 0;
	var max = 0;
	var timeoutId = undefined;
	Timer = {
		start: function(time, callback){
			left = time;
			max = time;
			timeoutId = setTimeout(function(){
				Timer.stop();
				callback();
			}, left);
		},

		stop: function(){
			left = 0;
			clearTimeout(timeoutId);
		},

		left: function(){
			return left;
		},

		update: function(){
			if(left > 0) left = Math.max(0, left - 100);
		},

		angle: function(){
			return left / max * 360;
		}
	};
})()
