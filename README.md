# biflora

## Install

```
$ npm install --save biflora
```

## Usage

```js
var express = require('express'),
	app = express();
var server = require('http').Server(app);
var biflora = require('biflora');

var main = new yourMainObjectClass();
var backendApis = {
	'api1': function( data, callback, main, socket ){
		callback('result');
	} ,
	'api2': function( data, callback, main, socket ){
		callback('result');
	}
};

// middleware - biflora resources
app.use( biflora.clientLibs() );
biflora.setupWebSocket(server, backendApis, main);

// middleware
app.use( function(req, res, next){
	/* your application here */
} );


server.listen( 3000, function(){
	console.log('message: server-standby');
} );
```
