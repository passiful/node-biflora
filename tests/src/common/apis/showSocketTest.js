/**
 * API: showSocketTest
 */
module.exports = function( data, callback, main, socket ){
	console.log(data);
	alert(data.message);
	callback(data);
	return;
}
