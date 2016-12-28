var fs = require('fs');
var path = require('path');
var express = require('express'),
	app = express();
var expressSession = require('express-session') // セッション管理
var Session = expressSession.Session;
var sessionStore = new expressSession.MemoryStore();
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


// middleware - session & request
app.use( require('body-parser')() );
app.use( expressSession({
	secret: "passiflora",
    resave: true,
    saveUninitialized: true,
	store: sessionStore,
	cookie: {
		'httpOnly': false
	}
}) );

// middleware - biflora resources
app.use( biflora.clientLibs() );
var io = require('socket.io')(server);

// session shareing
io.use( function(socket, next){

	// getting sessionId from cookie
	var sessionId = require('cookie').parse( socket.request.headers.cookie )['connect.sid'];
	sessionId = sessionId.replace(/^s\:([\s\S]+?)\.[\s\S]*$/, '$1');

	// getting session contents
	sessionStore.get( sessionId, function(err, sessionData){
		if( !err ){
			if( !socket.session ){
				// initialize session
				socket.session = new Session({sessionID: sessionId, sessionStore: sessionStore}, sessionData);
			}
		}else{
			console.error('************ FAILED to session handshake.');
		}
		next();
	});
});

biflora.setupWebSocket(server, backendApis, main, {
	'namespace': '/',
	'socketIo': io
});

// middleware - session shareing test
app.use( function(req, res, next){
	console.log(req.session);
	req.session.date = req.session.date || {};
	req.session.date[new Date()] = new Date();
	next();
} );

// middleware - frontend documents
app.use( express.static( __dirname+'/../htdocs/' ) );

// {$_port}番ポートでLISTEN状態にする
server.listen( _port, function(){
	console.log('message: server-standby');
} );
