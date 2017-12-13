const request = require('request-promise');

/**
 * Base 'request-promise' wrapper
 * @param  {Object} options The request options
 * @return {Promise}
 */
function rp(uri, options) {
	return request( Object.assign({ uri, method:'get', json:true }, options) );
}

module.exports = {
	/**
	 * Send GET Request.
	 * Respond w/ Payload || ErrorResponse object.
	 * @param  {String} uri    The URL to request
	 * @param  {Object} opts   The Request Options
	 * @return {Promise}
	 */
	get(uri, opts) {
		opts = opts || {};
		opts.qs = opts.qs || opts.params || {};
		return rp(uri, opts);
	},

	/**
	 * Send GET Request.
	 * Repond w/ full Response object, always.
	 * @param  {String} uri   The URL to request
	 * @param  {Object} opts  The Request Options
	 * @return {Promise}
	 */
	getResponse(uri, opts) {
		opts = opts || {};
		opts.resolveWithFullResponse = true;
		return this.get(uri, opts);
	},

	/**
	 * Send POST Request.
	 * Repond w/ Payload || ErrorResponse object.
	 * @param  {String} uri   The URL to request
	 * @param  {Object} opts  The Request Options
	 * @return {Promise}
	 */
	post(uri, opts) {
		opts = opts || {};
		opts.method = 'post';
		return rp(uri, opts);
	},

	/**
	 * Send POST Request.
	 * Repond w/ full Response object, always.
	 * @param  {String} uri     The URL to request
	 * @param  {Object} options The Request Options
	 * @return {Promise}
	 */
	postResponse(uri, opts) {
		opts = opts || {};
		opts.resolveWithFullResponse = true;
		return this.post(uri, opts);
	},

	/**
	 * Send PUT Request.
	 * Repond w/ Payload || ErrorResponse object.
	 * @param  {String} uri   The URL to request
	 * @param  {Object} opts  The Request Options
	 * @return {Promise}
	 */
	put(uri, opts) {
		opts = opts || {};
		opts.method = 'put';
		return rp(uri, opts);
	},

	/**
	 * Send PUT Request.
	 * Repond w/ full Response object, always.
	 * @param  {String} uri     The URL to request
	 * @param  {Object} options The Request Options
	 * @return {Promise}
	 */
	putResponse(uri, opts) {
		opts = opts || {};
		opts.resolveWithFullResponse = true;
		return this.put(uri, opts);
	},

	/**
	 * Send DELETE Request.
	 * Repond w/ Payload || ErrorResponse object.
	 * @param  {String} uri   The URL to request
	 * @param  {Object} opts  The Request Options
	 * @return {Promise}
	 */
	del(uri, opts) {
		opts = opts || {};
		opts.method = 'delete';
		return rp(uri, opts);
	},

	/**
	 * Send DELETE Request.
	 * Repond w/ full Response object, always.
	 * @param  {String} uri     The URL to request
	 * @param  {Object} options The Request Options
	 * @return {Promise}
	 */
	delResponse(uri, opts) {
		opts = opts || {};
		opts.resolveWithFullResponse = true;
		return this.del(uri, opts);
	}
};
