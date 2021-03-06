# biflora

## Install

```
$ npm install --save biflora
```

## Usage

### Server Side

```js
var express = require('express'),
	app = express();
var server = require('http').Server(app);
var biflora = require('biflora');

var main = new yourMainObjectClass();
var backendApis = {
	// custom API
	'api1': function( data, callback, main, biflora ){
		callback('result1');
	} ,
	// custom API
	'api2': function( data, callback, main, biflora ){
		callback('result2');
	} ,
	// API name "disconnect" has been reserved.
	// Fired on user disconnection.
	'disconnect': function( data, callback, main, biflora ){
		console.log('USER DISCONNECT');
		console.log('-- disconnected user info:', data);
	}
};

// middleware - biflora resources
app.use( biflora.clientLibs() );
var options = {
	'namespace': '/', // namespace for socket.io
	'socketIo': require('socket.io')(server) // socket.io object
};
biflora.setupWebSocket(server, backendApis, main, options);

// middleware
app.use( function(req, res, next){
	/* your application here */
} );


server.listen( 3000, function(){
	console.log('message: server-standby');
} );
```

### Client Side

```html
<!-- socket.io -->
<script src="/socket.io/socket.io.js" type="text/javascript"></script>
<!-- biflora -->
<script src="/biflora/biflora.js" type="text/javascript"></script>

<script type="text/javascript">
	var bfSocket = window.biflora
		.createSocket(
			new yourMainObjectClass(),
			io,
			{
				// custom API
				'api1': function( data, callback, main, biflora ){
					callback('result1');
				},
				// custom API
				'api2': function( data, callback, main, biflora ){
					callback('result2');
				}
			},
			{ // Options
				'server': 'https://example.com/' // server origin
			}
		)
	;
</script>
```

## ライセンス - License

Copyright (c)2016 Tomoya Koyanagi, and Passiful Project<br />
MIT License https://opensource.org/licenses/mit-license.php


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
