/**
 * biflora framework
 */
(function(module){
	module.exports = {};

	module.exports.createSvrCtrl = function(){
		return require(__dirname+'/svrCtrl.js');
	}

	module.exports.conf = function(){
		return require(__dirname+'/conf.js');
	}

})(module);
