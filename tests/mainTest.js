var Promise = require("es6-promise").Promise;
var assert = require('assert');
var webDriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;

var path = require('path');
var fs = require('fs');
var phpjs = require('phpjs');
var packageJson = require(__dirname+'/../package.json');
var svrCtrl = require(__dirname+'/../lib/svrCtrl.js');


describe('アプリケーション(ExpressServer)を起動する', function() {

	it('ExpressServerを起動します', function(done) {
		this.timeout(10000);
		svrCtrl.boot(function(){
			// assert.equal(1, 1);
			done();
		});
	});

	it('トップページを取得します', function(done) {
		this.timeout(10000);

		var driver = new webDriver.Builder()
			.forBrowser('phantomjs')
			.build();

		driver.get('http://127.0.0.1:8080/')
			.then(function(){
				return driver.wait(until.titleIs('Baobab Framework'), 1000);
			})
			.then(function(){
				return driver.getPageSource();
			})
			.then(function(res){
				return new Promise(function(resolve, reject){
					// console.log(res);
					resolve();
				});
			})
			.then(function(){
				return driver.findElement(By.tagName("p")).getText();
			})
			.then(function(res){
				return new Promise(function(resolve, reject){
					assert.equal('test page.', res);
					resolve();
				});
			})
			.then(function(){
				// console.log('quit');
				return driver.quit();
			})
			.then(function(){
				done();
			})
		;

	});

	it('ExpressServerを終了します', function(done) {
		this.timeout(10000);
		svrCtrl.halt(function(){
			// assert.equal(1, 1);
			done();
		});
	});

});
