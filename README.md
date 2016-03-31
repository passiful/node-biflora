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

### Client Side

```html
<!-- socket.io -->
<script src="/socket.io/socket.io.js" type="text/javascript"></script>
<!-- biflora -->
<script src="/biflora/biflora.js" type="text/javascript"></script>

<script type="text/javascript">
	var socket = this.socket = window.biflora
		.createSocket(
			new yourMainObjectClass(),
			io,
			{
				'api1': function( data, callback, main, socket ){
					callback('result');
				},
				'api2': function( data, callback, main, socket ){
					callback('result');
				}
			}
		)
	;
</script>
```
