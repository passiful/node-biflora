module.exports = new (function(){
	var funcs = {};

	this.addNewFunction = function(fnc){
		var i = 0;
		while( 1 ){
			i ++;
			if( !funcs['fnc'+i] ){
				funcs['fnc'+i] = fnc;
				return 'fnc'+i;
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