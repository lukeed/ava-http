'use strict';
const test = require('ava');
const assign = require('object-assign');
const request = require('request-promise');

const http = {};

/**
 * Request defaults
 */
const defaults = {
	method: 'get',
	json: true
};

/**
 * Base 'request-promise' wrapper
 * @param  {Object} options The request options
 * @return {Promise}
 */
async function rp(options = {}) {
	return await request(assign({}, defaults, options));
}

/**
 * Send GET Request.
 * Repond w/ Payload || ErrorResponse object.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.get = async function(uri, options = {}) {
	options.qs = options.qs || options.params || {};
	return await rp(assign({uri}, options));
};

/**
 * Send GET Request.
 * Repond w/ full Response object, always.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.getResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.get(uri, options);
};

/**
 * Send POST Request.
 * Repond w/ Payload || ErrorResponse object.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.post = async function(uri, options = {}) {
	return await rp(assign(options, {uri, method: 'post'}));
};

/**
 * Send POST Request.
 * Repond w/ full Response object, always.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.postResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.post(uri, options);
};

/**
 * Send PUT Request.
 * Repond w/ Payload || ErrorResponse object.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.put = async function(uri, options = {}) {
	return await rp(assign(options, {uri, method: 'put'}));
};

/**
 * Send PUT Request.
 * Repond w/ full Response object, always.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.putResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.put(uri, options);
};

/**
 * Send DELETE Request.
 * Repond w/ Payload || ErrorResponse object.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.del = async function(uri, options = {}) {
	return await rp(assign(options, {uri, method: 'delete'}));
};

/**
 * Send DELETE Request.
 * Repond w/ full Response object, always.
 * @param  {String} uri     The URL to request
 * @param  {Object} options The Request Options
 * @return {Promise}
 */
http.delResponse = async function(uri, options = {}) {
	options.resolveWithFullResponse = true;
	return await this.del(uri, options);
};

/**
 * Attach the HTTP methods to Ava/Test Object.
 *
 * @todo:  Wait for AVA to expose inner Test class
 * @todo:  so that we can use `test.before()` once.
 */
test.beforeEach(t => {
	t.context.http = http;
});

module.exports = test;
