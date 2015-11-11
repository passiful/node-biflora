var fs = require('fs');
var path = require('path');
var express = require('express'),
	app = express();
var server = require('http').Server(app);
var conf = require(__dirname+'/../conf.js');
var options = (function(){
	// console.log(process.argv);
	var rtn = {};
	for( var idx = 0; process.argv.length > idx; idx ++ ){
		if(process.argv[idx].match(new RegExp('^(.*?)\=(.*)$'))){
			rtn[RegExp.$1] = RegExp.$2;
		}
	}
	return rtn;
})();
// console.log(options);

var main = require(conf.get().backendJs);



var _port = options['port'];
if(!_port){_port = conf.get().defaultPort;}
if(!_port){_port = 8080;}
console.log('port number is '+_port);

// middleware - baobab-fw resources
app.use( express.static( path.resolve(__dirname, '../../frontend/') ) );

// middleware - frontend documents
app.use( express.static( conf.get().frontendDocumentRoot ) );

// {$_port}番ポートでLISTEN状態にする
server.listen( _port, function(){
	console.log('message: server-standby');
} );

var io = require('socket.io')(server);
io.on('connection', function (socket) {
	return new (function(socket){
		var _this = this;
		_this.socket = socket;
		_this.temporaryApis = require('../temporaryApis.js');
		_this.pingApi = require('../pingApi.js');
		this.send = function(api, data, callback){
			var args = {
				api: api ,
				data: data ,
				callback: _this.temporaryApis.addNewFunction(callback)
			};
			args.pingName = _this.pingApi.addNewTimer(args.callback);
			this.socket.broadcast.emit('baobab-command', JSON.stringify(args));
			this.socket.emit('baobab-command', JSON.stringify(args));
			return this;
		}

		// console.log('Socket Connected.');
		_this.socket.on('baobab-command', function (cmd) {
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
			_this.socket.emit('baobab-pingAnswerCall', cmd.pingName);

			var commandName = cmd.api.replace(new RegExp('[^a-zA-Z0-9\\_\\-]+','g'), '');
			console.log( '--- [backend] on command' );
			console.log( 'api: '+cmd.api+'; callback: '+cmd.callback );
			console.log( cmd );

			var api = _this.temporaryApis.getCallbackFunction(cmd.api);
			var temporaryApiName = cmd.callback;
			if( !api && fs.existsSync( conf.get().backendApis+'/'+cmd.api+'.js' ) ){
				api = require( conf.get().backendApis+'/'+cmd.api+'.js' );
			}
			if(api){
				api( cmd.data, function(data){
					_this.temporaryApis.callRemoteFunction( _this, temporaryApiName, data );
				}, main, _this );
			}
			return;
		});
		_this.socket.on('baobab-pingAnswerCall', function (cmd) {
			_this.pingApi.clearTimer(cmd);
		});
	})(socket);

});
