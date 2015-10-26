module.exports = new (function(){
	var funcs = {};

	function createUUID(){
		return "uuid-"+((new Date).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16));
	}
	this.addNewFunction = function(fnc){
		var i = 0;
		while( 1 ){
			i = createUUID();
			if( !funcs['fnc-'+i] ){
				funcs['fnc-'+i] = fnc;
				return 'fnc-'+i;
			}
		}
		return false;
	}

	this.getCallbackFunction = function(fncName){
		if(funcs[fncName]){
			var rtn = funcs[fncName];
			funcs[fncName] = null;
			return rtn;
		}
		return false;
	}
	this.callRemoteFunction = function(soc, fncName, data){
		soc.send(fncName, data);
	}

})();
