/**
 * biflora framework
 */
(function(module){
	module.exports = {};
	var path = require('path');
	var express = require('express');
	var socketIo = require('socket.io');

	module.exports.clientLibs = function(){
		return express.static( path.resolve(__dirname, '../frontend/') );
	}
	module.exports.setupWebSocket = function(server, backendApis, main, namespace){
		namespace = namespace || '/';

		var io = socketIo(server);
		var nsp = io.of(namespace);
		nsp.on('connection', function (socket) {
			return new (function(socket){
				console.log('||=--=--=--= new connection to namespace:'+namespace+' =--=--=--=||');
				var _this = this;
				_this.socket = socket;
				_this.temporaryApis = require('./temporaryApis.js');
				_this.pingApi = require('./pingApi.js');
				this.send = function(api, data, callback){
					var args = {
						api: api ,
						data: data ,
						callback: _this.temporaryApis.addNewFunction(callback)
					};
					args.pingName = _this.pingApi.addNewTimer(args.callback);
					this.socket.broadcast.emit('biflora-command', JSON.stringify(args));
					this.socket.emit('biflora-command', JSON.stringify(args));
					return this;
				}

				// console.log('Socket Connected.');
				_this.socket.on('biflora-command', function (cmd) {
					var rtn = {};
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

					var commandName = cmd.api.replace(new RegExp('[^a-zA-Z0-9\\_\\-]+','g'), '');
					console.log( '--- [backend] on command' );
					console.log( 'api: '+cmd.api+'; callback: '+cmd.callback );
					console.log( cmd );

					var api = _this.temporaryApis.getCallbackFunction(cmd.api);
					var temporaryApiName = cmd.callback;
					try {
						if( !api && backendApis[cmd.api] ){
							api = backendApis[cmd.api];
						}
					} catch (e) {
					}
					if(api){
						api( cmd.data, function(data){
							_this.temporaryApis.callRemoteFunction( _this, temporaryApiName, data );
						}, main, _this );
					}
					return;
				});
				_this.socket.on('biflora-pingAnswerCall', function (cmd) {
					_this.pingApi.clearTimer(cmd);
				});
			})(socket);

		});

	}

})(module);
