/**
 * API: broadcast
 */
module.exports = function( data, callback, main, socket ){
	// console.log(main);
	data.main = main;
	socket.broadcast('showSocketTest', data);
	callback(data);
	return;
}
