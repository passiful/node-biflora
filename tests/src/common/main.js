/**
 * main.js
 */
window.main = new (function(){
	// var it79 = this.it79 = require('iterate79');
	var jQuery = $ = require('./scripts/jquery.js');
	var php = this.php = require('phpjs');
	var __dirname = (function(){ var rtn = (function() { if (document.currentScript) {return document.currentScript.src;} else { var scripts = document.getElementsByTagName('script'), script = scripts[scripts.length-1]; if (script.src) {return script.src;} } })(); rtn = rtn.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''); return rtn; })();
	var biflora = this.biflora = window.biflora
		.createSocket(
			this,
			io,
			{
				'showSocketTest': require('./apis/showSocketTest.js')
			}
		)
	;

	function windowResized(){
		// console.log('window resized');
	}

	/**
	 * initialize
	 * @param  {Function} callback Callback function.
	 * @return {Object}            return this;
	 */
	this.init = function(callback){
		callback = callback || function(){};

		window.focus();
		$(window).resize(windowResized);
		setTimeout(function(){
			callback();
		}, 0);

		return this;
	}

	/**
	 * WebSocket疎通確認
	 */
	this.socketTest = function(){
		alert('send command `socketTest`');
		biflora.send(
			'socketTest',
			{'message': 'socketTest from frontend.'} ,
			function(data){
				alert('callback function is called!');
				console.log(data);
			}
		);
		return this;
	}

	/**
	 * broadcast
	 */
	this.broadcastTest = function(){
		alert('send command `broadcast`');
		biflora.send(
			'broadcast',
			{'message': 'broadcastTest from frontend.'} ,
			function(data){
				alert('callback function is called!');
				console.log(data);
			}
		);
		return this;
	}

	/**
	 * 偽の値を送ってみる確認
	 */
	this.socketSendFalse = function(){
		alert('send command `socketSendFalse`');
		biflora.send(
			'socketSendFalse',
			false ,
			function(data){
				console.log(data);
			}
		);
		return this;
	}

	/**
	 * roomに参加する/退場する
	 */
	this.joinRoom = function(roomName, join){
		alert((join?'join':'leave')+' to room `'+roomName+'`');
		biflora.joinRoom(
			roomName,
			join ,
			function(data){
				alert('join to room done.');
				console.log(data);
			}
		);
		return this;
	}

	/**
	 * sendToRoom
	 */
	this.sendToRoom = function(roomName){
		alert('send to room `'+roomName+'`');
		biflora.send(
			'sendToRoom',
			{'message': 'sendToRoom from frontend.','room':roomName} ,
			function(data){
				alert('callback function is called!');
				console.log(data);
			}
		);
		return this;
	}


})();
