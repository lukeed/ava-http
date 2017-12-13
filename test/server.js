const micro = require('micro');
const { send, json } = require('micro');

exports.send = send;
exports.json = json;

/**
 * Spins up a micro-server per test. Would not do this in real app testing
 * @param  {Function} fn   The server response function
 * @param  {Object}   opts Additional options
 * @return {String}        The micro-server's URI for requests
 */
exports.listen = function (fn, opts) {
	const srv = micro(fn, opts);
	return new Promise((res, rej) => {
		srv.listen(err => {
			if (err) return rej(err);
			const { port } = srv.address();
			return res(`http://localhost:${port}`);
		});
	});
};
