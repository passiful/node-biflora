window.biflora = (function(){

	var biflora = function(){}

	biflora.prototype.createSocket = function(main, io, apis){
		var host = window.location.origin;
		// host = 'http://127.0.0.1:60603/';

		return new (function(main, io, host, apis){
			var _this = this;
			this.main = main;
			this.apis = apis;
			this.temporaryApis = require('../../lib/temporaryApis.js');
			this.pingApi = require('../../lib/pingApi.js');

			_this.socket = io.connect( host );
			this.send = function(api, data, callback){
				var args = {
					api: api ,
					data: data ,
					callback: _this.temporaryApis.addNewFunction(callback)
				};
				args.pingName = _this.pingApi.addNewTimer(args.callback);

				// console.log(args);
				_this.socket.emit('biflora-command', JSON.stringify(args));
				return this;
			}
			_this.socket.on('biflora-command', function (cmd) {
				// console.log(cmd);
				try {
					cmd = JSON.parse(cmd);
				} catch (e) {
				}
				cmd = cmd || {};
				cmd.api = cmd.api || '';
				// cmd.data = cmd.data || {};
				cmd.callback = cmd.callback || null;
				cmd.pingName = cmd.pingName || null;
				_this.socket.emit('biflora-pingAnswerCall', cmd.pingName);

				var api = _this.temporaryApis.getCallbackFunction(cmd.api);
				var temporaryApiName = cmd.callback;

				if( !api && _this.apis[cmd.api] ){
					api = _this.apis[cmd.api];
				}
				if(api){
					api( cmd.data, function(data){
						_this.temporaryApis.callRemoteFunction( _this, temporaryApiName, data );
					}, _this.main, _this );
				}
			});
			_this.socket.on('biflora-pingAnswerCall', function (cmd) {
				_this.pingApi.clearTimer(cmd);
			});
		})(main, io, host, apis);
	}

	return new biflora();
})();
