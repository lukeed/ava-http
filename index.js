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

http.getResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.get(uri, options);
};

http.post = async function(uri, options = {}) {
	return await rp(assign(options, {uri, method: 'post'}));
};

http.postResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.post(uri, options);
};

http.put = async function(uri, options = {}) {
	return await rp(assign(options, {uri, method: 'put'}));
};

http.putResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.put(uri, options);
};

http.del = async function(uri, options = {}) {
	return await rp(assign(options, {uri, method: 'delete'}));
};

http.delResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.del(uri, options);
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
