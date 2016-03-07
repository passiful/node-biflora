var fs = require('fs');
var path = require('path');
var express = require('express'),
	app = express();
var server = require('http').Server(app);
var biflora = require(__dirname+'/../../lib/main.js');

var main = require(__dirname+'/main.js');
var _port = 8080;
console.log('port number is '+_port);


var backendApis = {};
var apiFileList = fs.readdirSync( __dirname+'/apis/' );
for( var idx in apiFileList ){
	// console.log(apiFileList[idx]);
	if( !apiFileList[idx].match(new RegExp('(.*)\\.js$','i')) ){
		continue;
	}
	var apiName = RegExp.$1;
	backendApis[apiName] = require( __dirname+'/apis/'+apiFileList[idx] );
}
// console.log(backendApis);


// middleware - biflora resources
app.use( biflora.clientLibs() );
biflora.setupWebSocket(server, backendApis, main);

// middleware - frontend documents
app.use( express.static( __dirname+'/../htdocs/' ) );

// {$_port}番ポートでLISTEN状態にする
server.listen( _port, function(){
	console.log('message: server-standby');
} );
