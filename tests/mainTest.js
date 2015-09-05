var assert = require('assert');
// var phantomjs = require('phantomjs');
var path = require('path');
var fs = require('fs');
var phpjs = require('phpjs');
var packageJson = require(__dirname+'/../package.json');
var svrCtrl = require(__dirname+'/../lib/svrCtrl.js');


describe('アプリケーション(ExpressServer)を起動する', function() {

	it('ExpressServerを起動します', function(done) {
		this.timeout(10000);
		svrCtrl.boot(function(){
			assert.equal(1, 1);
			done();
		});
	});

	it('ExpressServerを終了します', function(done) {
		this.timeout(10000);
		svrCtrl.halt(function(){
			assert.equal(1, 1);
			done();
		});
	});

});
