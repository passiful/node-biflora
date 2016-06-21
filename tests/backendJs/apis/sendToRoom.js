/**
 * API: sendToRoom
 */
module.exports = function( data, callback, main, biflora ){
	// console.log(main);
	data.main = main;
	biflora.sendToRoom('showSocketTest', data, data.room);
	callback(data);
	return;
}
