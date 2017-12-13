'use strict';

// require('nodent')();
const test = require('ava');
const http = require('../lib');
const { listen, send, json } = require('./server');

const str = 'ava-http';
const obj = { a:123 };

/**
 * @todo: Create a Test server with all routes pre-defined.
 * Initialize on `test.before()`
 */

test('import http object', t => {
	t.true(typeof http === 'object', 'http object exists');

	for (let k of ['get', 'post', 'put', 'del']) {
		t.true(http.hasOwnProperty(k) && (typeof http[k] === 'function'), `http.${k} added`);
	}
});

test('http.get: async/await', async t => {
	// spin up the test server
	const url = await listen(async (req, res) => send(res, 200, str));
	// get the response by waiting
	t.is(await http.get(url), str);
});

test('http.get: generator/yield', function * (t) {
	// spin up the test server
	const url = yield listen((req, res) => send(res, 200, str));
	// get the response by waiting
	t.is(yield http.get(url), str);
});

test('http.get: thennable', async t => {
	t.plan(1);
	// spin up the test server
	const url = await listen((req, res) => send(res, 200, str));
	// get the response with .then()
	await http.get(url).then(res => {
		t.is(res, str);
	});
});

/**
 * GET REQUESTS
 */

test('http.get: String <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, str));
	t.is(await http.get(url), str);
});

test('http.get: Object String <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const res = await http.get(url, {json: false});
	t.true(typeof res === 'string');
	t.is(res, JSON.stringify(obj));
});

test('http.get: Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	t.deepEqual(await http.get(url), obj);
});

test('http.get: with Parameters <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));

	const params = {token: '123456789'};
	t.deepEqual(await http.get(url, {params}), obj);
});

test('http.get: server is not async', async t => {
	const url = await listen((req, res) => send(res, 200, obj));
	t.deepEqual(await http.get(url), obj);
});

/**
 * POST REQUESTS
 */

test('http.post: Success <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	// use postResponse to get full Reponse object on success
	const res = await http.postResponse(url);
	t.is(res.statusCode, 200);
});

test('http.post: Bad Request <400>', async t => {
	const url = await listen(async (req, res) => send(res, 400));
	await http.post(url).catch(err => t.is(err.statusCode, 400));
});

test('http.post: JSON Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, str));
	const body = {some: 'payload'};
	t.is(await http.post(url, {body}), str);
});

test('http.post: Form Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, str));
	const form = {some: 'payload'}; // will be urlencoded
	t.is(await http.post(url, {form}), str);
});

/**
 * PUT REQUESTS
 */

test('http.put: Success <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200));
	// use putResponse to get full Reponse object on success
	const res = await http.putResponse(url);
	t.is(res.statusCode, 200);
});

test('http.put: Bad Request <400>', async t => {
	const url = await listen(async (req, res) => send(res, 400));
	await http.put(url).catch(err => t.is(err.statusCode, 400));
});

test('http.put: JSON Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, str));
	const body = {some: 'payload'};
	t.is(await http.put(url, {body}), str);
});

test('http.put: Form Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, str));
	const form = {some: 'payload'}; // will be urlencoded
	t.is(await http.put(url, {form}), str);
});

/**
 * DELETE REQUESTS
 */

test('http.del: Success <200>', async t => {
	const url = await listen((req, res) => send(res, 200));
	// use delResponse to get full Reponse object on success
	const res = await http.delResponse(url);
	t.is(res.statusCode, 200);
});

test('http.del: Bad Request <400>', async t => {
	const url = await listen((req, res) => send(res, 400));
	await http.del(url).catch(err => t.is(err.statusCode, 400));
});

test('http.del: Unauthorized <401>', async t => {
	const url = await listen((req, res) => send(res, 401));
	await http.del(url).catch(err => t.is(err.statusCode, 401));
});

test('http.del: Not Found <404>', async t => {
	const url = await listen(async (req, res) => send(res, 404));
	await http.del(url).catch(err => t.is(err.statusCode, 404));
});

/**
 * RESPONSE CODES / HANDLERS
 */

test('Response: 200 <Code>', async t => {
	const url = await listen(async (req, res) => send(res, 200));
	// Use getResponse for full data. Added to Error responses by default.
	const res = await http.getResponse(url);
	t.is(res.statusCode, 200);
});

test('Response: 301 <Code>', async t => {
	const url = await listen(async (req, res) => send(res, 301));
	await http.get(url).catch(err => {
		t.is(err.statusCode, 301);
	});
});

test('Response: 404 <Code>', async t => {
	const url = await listen(async (req, res) => send(res, 404));
	await http.get(url).catch(err => t.is(err.statusCode, 404));
});

test('Response: 404 <Object>', async t => {
	const url = await listen(async (req, res) => send(res, 404, obj));
	await http.get(url).catch(err => t.deepEqual(err.response.body, obj));
});
