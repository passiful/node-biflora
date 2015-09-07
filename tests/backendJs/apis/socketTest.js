/**
 * API: socketTest
 */
module.exports = function( data, callback, main, socket ){
	// console.log(main);
	data.main = main;
	socket.send('showSocketTest', data);
	callback(data);
	return;
}
