/**
 * biflora framework
 */
(function(module){
	module.exports = {};
	var path = require('path');
	var express = require('express');
	var io;
	var namespace = '/';

	/**
	 * clientLibs
	 * @return {[type]} [description]
	 */
	module.exports.clientLibs = function(){
		return express.static( path.resolve(__dirname, '../frontend/') );
	} // clientLibs()

	/**
	 * setup WebSocket
	 */
	module.exports.setupWebSocket = function(server, backendApis, main, options){

		if( typeof(options) == typeof({}) ){
			namespace = options.namespace || namespace; // namespace for socket.io
			io = options.socketIo; // socket.io object
		}else if( typeof(options) == typeof('') ){
			namespace = options;//古い仕様の互換性維持。第4引数は `namespace` だった。
		}

		if(!io){
			io = require('socket.io')(server);
		}
		var nsp = io.of(namespace);
		var userList = {};

		nsp.on('connection', function (socket) {
			return new (function(socket){
				console.log('');
				console.log('||=--=--=--= new connection to namespace:'+namespace+' =--=--=--=||');
				console.log('');

				var _this = this;
				_this.socket = socket;
				_this.temporaryApis = require('./temporaryApis.js');
				_this.pingApi = require('./pingApi.js');
				this.send = function(api, data, callback){
					var args = {
						'api': api ,
						'data': data ,
						'callback': _this.temporaryApis.addNewFunction(callback)
					};
					args.pingName = _this.pingApi.addNewTimer(args.callback);
					this.socket.emit('biflora-command', JSON.stringify(args));
					return this;
				}
				this.sendToRoom = function(api, data, room, callback){
					var args = {
						'api': api ,
						'data': data ,
						'callback': _this.temporaryApis.addNewFunction(callback)
					};
					args.pingName = _this.pingApi.addNewTimer(args.callback);
					this.socket.to(room).emit('biflora-command', JSON.stringify(args));
					return this;
				}
				this.broadcast = function(api, data, callback){
					var args = {
						'api': api ,
						'data': data ,
						'callback': _this.temporaryApis.addNewFunction(callback)
					};
					args.pingName = _this.pingApi.addNewTimer(args.callback);
					this.socket.broadcast.emit('biflora-command', JSON.stringify(args));
					return this;
				}

				// ユーザーに関する情報
				_this.userInfo = {};
				_this.userInfo.connectionId = _this.socket.id;
				userList[_this.userInfo.connectionId] = _this;
				console.log(_this.userInfo);
				console.log('-- userList:', userList);
				console.log('');

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

					var commandName = cmd.api.replace(new RegExp('[^a-zA-Z0-9\\_\\-]+','g'), '');
					console.log( '--- [backend] on command' );
					console.log( 'api: '+cmd.api+'; callback: '+cmd.callback );
					console.log( cmd );
					console.log('');

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
					_this.socket.emit('biflora-pingAnswerCall', cmd.pingName);
					return;
				});
				_this.socket.on('biflora-pingAnswerCall', function (cmd) {
					_this.pingApi.clearTimer(cmd);
				});
				_this.socket.on('biflora-joinRoom', function (cmd) {
					var rtn = {};
					// console.log(cmd);
					try {
						cmd = JSON.parse(cmd);
					} catch (e) {
					}
					cmd = cmd || {};
					cmd.room = cmd.room || '';
					// cmd.join = cmd.join || 1;
					cmd.callback = cmd.callback || null;
					cmd.pingName = cmd.pingName || null;
					var temporaryApiName = cmd.callback;

					console.log( '--- [backend] on joinRoom' );
					console.log( 'room: '+cmd.room+'; join: '+cmd.join+'; callback: '+cmd.callback );
					console.log( cmd );
					console.log('');
					if( cmd.join ){
						_this.socket.join(cmd.room);
					}else{
						_this.socket.leave(cmd.room);
					}

					_this.socket.emit('biflora-pingAnswerCall', cmd.pingName);
					if(temporaryApiName){
						_this.temporaryApis.callRemoteFunction( _this, temporaryApiName, true );
					}
				});
				_this.socket.on('disconnect', function () {
					console.log( '*********** USER DISCONNECT ***********' );
					console.log('-- Leaved user:', _this.userInfo);
					userList[_this.userInfo.connectionId] = undefined;
					delete(userList[_this.userInfo.connectionId]);
					console.log('-- userList:', userList);
					console.log('');
					try {
						if( backendApis['disconnect'] ){
							backendApis['disconnect']( _this.userInfo, function(data){}, main, _this );
						}
					} catch (e) {
					}
				});

			})(socket);

		});

	} // setupWebSocket()

})(module);
