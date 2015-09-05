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

// middleware
app.use( express.static( conf.get().frontendDocumentRoot ) );

// {$_port}番ポートでLISTEN状態にする
server.listen( _port, function(){
	console.log('message: server-standby');
} );

var io = require('socket.io')(server);
io.on('connection', function (socket) {
	return new (function(socket){
		_this = this;
		_this.socket = socket;
		_this.temporaryApis = require(__dirname+'/../temporaryApis.js');
		this.send = function(api, data, callback){
			var args = {
				api: api ,
				data: data ,
				callback: _this.temporaryApis.addNewFunction(callback)
			};
			this.socket.emit('command', args);
			return this;
		}

		// console.log('Socket Connected.');
		_this.socket.on('command', function (cmd) {
			var rtn = {};
			cmd = cmd || {};
			cmd.api = cmd.api || '';
			cmd.data = cmd.data || {};
			cmd.callback = cmd.callback || null;
			var commandName = cmd.api.replace(new RegExp('[^a-zA-Z0-9\\_\\-]+','g'), '');
			console.log( 'message: [backend] on command' );
			console.log( 'message: api: '+cmd.api+'; callback: '+cmd.callback );

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
	})(socket);

});
