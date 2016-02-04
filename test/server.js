'use strict';
import micro from 'micro';
import {send, json} from 'micro';

exports.send = send;
exports.json = json;

/**
 * Spins up a micro-server per test. Would not do this in real app testing
 * @param  {Function} fn   The server response function
 * @param  {Object}   opts Additional options
 * @return {String}        The micro-server's URI for requests
 */
exports.listen = async function (fn, opts) {
	const srv = micro(fn, opts);
	return new Promise((resolve, reject) => {
		srv.listen((err) => {
			if (err) {
				return reject(err);
			}
			const {port} = srv.address();
			resolve(`http://localhost:${port}`);
		});
	});
};
