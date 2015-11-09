module.exports = new (function(){
	var pingTimers = {};

	function createUUID(){
		return "uuid-"+((new Date).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16));
	}
	this.addNewTimer = function(fncName){
		var pingName = createUUID();
		if(typeof(fncName) === typeof('')){
			pingName = fncName;
		}
		var i = 0;
		while( 1 ){
			if( !pingTimers[pingName] ){
				pingTimers[pingName] = setTimeout(function(){
					console.error(pingName+': 1000msec 待っても返信が得られませんでした。');
				}, 1000);
				return pingName;
			}
		}
		return false;
	}

	this.clearTimer = function(pingName){
		if(pingTimers[pingName]){
			var rtn = pingTimers[pingName];
			clearTimeout(pingTimers[pingName]);
			pingTimers[pingName] = null;
			delete(pingTimers[pingName]);
			// console.log(pingTimers);
			return rtn;
		}
		return false;
	}

})();
