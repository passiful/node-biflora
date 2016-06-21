/**
 * API: socketTest
 */
module.exports = function( data, callback, main, biflora ){
	// console.log(main);
	data.main = main;
	biflora.send('showSocketTest', data);
	callback(data);
	return;
}
