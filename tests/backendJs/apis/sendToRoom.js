/**
 * API: sendToRoom
 */
module.exports = function( data, callback, main, socket ){
	// console.log(main);
	data.main = main;
	socket.sendToRoom('showSocketTest', data, data.room);
	callback(data);
	return;
}
