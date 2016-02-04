'use strict';
import test from 'ava';
import assign from 'object-assign';
import request from 'request-promise';

const http = {};

const defaults = {
	method: 'get',
	json: true
};

function req(options = {}) {
	const opts = assign({}, defaults, options);
	console.log('this is req opts: ', opts);
	const rp = request(opts);
	console.log(rp);
	return rp;
}

http.get = async function(uri, options = {}) {
	const data = await req(assign({uri}, options));
	console.log(data);
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

// http('name of test', t => {
// 	t.get(url).then()
// })

/**
 * @todo:  Wait for AVA to expose inner Test class
 * @todo:  so that we can use `test.before()` once.
 */
test.beforeEach(t => {
	t.context.http = http;
});

module.exports = test;
