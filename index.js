'use strict';
const test = require('ava');
const assign = require('object-assign');
const request = require('request-promise');

const http = {};

const defaults = {
	method: 'get',
	json: true
};

async function rp(options = {}) {
	return await request(assign({}, defaults, options));
}

http.get = async function(uri, options = {}) {
	options.qs = options.qs || options.params || {};
	return await rp(assign({uri}, options));
};

http.post = async function(uri, options = {}) {
	console.log(uri, options);
};

http.put = async function(uri, options = {}) {
	console.log(uri, options);
};

http.del = async function(uri, options = {}) {
	console.log(uri, options);
};

/**
 * @todo:  Wait for AVA to expose inner Test class
 * @todo:  so that we can use `test.before()` once.
 */
test.beforeEach(t => {
	t.context.http = http;
});

/**
 * @todo:  Ideal test syntax
 */
// http('name of test', t => {
// 	t.get(url).then();
// });

module.exports = test;
