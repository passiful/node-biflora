var fs = require('fs');
var path = require('path');
var express = require('express'),
	app = express();
var server = require('http').Server(app);
var biflora = require(__dirname+'/../main.js');
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


var backendApis = {};
var apiFileList = fs.readdirSync( conf.get().backendApis+'/' );
for( var idx in apiFileList ){
	// console.log(apiFileList[idx]);
	if( !apiFileList[idx].match(new RegExp('(.*)\\.js$','i')) ){
		continue;
	}
	var apiName = RegExp.$1;
	backendApis[apiName] = require( conf.get().backendApis+'/'+apiFileList[idx] );
}
// console.log(backendApis);


// middleware - biflora resources
app.use( biflora.clientLibs() );
biflora.setupWebSocket(server, backendApis, main);

// middleware - frontend documents
app.use( express.static( conf.get().frontendDocumentRoot ) );

// {$_port}番ポートでLISTEN状態にする
server.listen( _port, function(){
	console.log('message: server-standby');
} );
