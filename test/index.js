'use strict';
import test from '../';
import {listen, send, json} from './server';

const str = 'ava-http';
const obj = {a: 'b'};

/**
 * @todo: Create a Test server with all routes pre-defined.
 * Initialize on `test.before()`
 */

test('add http context methods to Test object', async t => {
	const http = t.context.http;
	const assertion = k => {
		return t.true(http.hasOwnProperty(k) && (typeof http[k] === 'function'), `http.${k} added`);
	};

	for (let key of ['get', 'post', 'put', 'del']) {
		assertion(key);
	}
});

test('http.get: await', async t => {
	// spin up the test server
	const url = await listen(async (req, res) => send(res, 200, str));
	// get the response by waiting
	const res = await t.context.http.get(url);
	t.same(res, str);
});

test('http.get: thennable', async t => {
	// spin up the test server
	const url = await listen(async (req, res) => send(res, 200, str));
	// get the response with .then()
	t.context.http.get(url).then(res => {
		t.same(res, str);
	});
});

/**
 * GET REQUESTS
 */

test('http.get: String <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, str));
	const res = await t.context.http.get(url);
	t.ok(typeof res === 'string');
	t.same(res, str);
});

test('http.get: Object String <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const res = await t.context.http.get(url, {json: false});
	t.true(typeof res === 'string');
	t.same(res, JSON.stringify(obj));
});

test('http.get: Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const res = await t.context.http.get(url);
	t.true(typeof res === 'object');
	t.same(res, obj);
});

test('http.get: with Parameters <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));

	const params = {token: '123456789'};
	const res = await t.context.http.get(url, {params});

	t.true(typeof res === 'object');
	t.same(res, obj);
});

test('http.get: server is not async', async t => {
	const url = await listen((req, res) => send(res, 200, obj));
	const res = await t.context.http.get(url);
	t.same(res, obj);
});

/**
 * POST REQUESTS
 */

test('http.post: Success <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	// use postResponse to get full Reponse object on success
	const res = await t.context.http.postResponse(url);
	t.same(res.statusCode, 200);
});

test('http.post: Bad Request <400>', async t => {
	const url = await listen(async (req, res) => send(res, 400, obj));
	t.context.http.post(url).catch(err => {
		t.same(err.statusCode, 400);
	});
});

test('http.post: JSON Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const body = {some: 'payload'};
	const res = await t.context.http.post(url, {body});
	t.same(res, obj);
});

test('http.post: Form Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const form = {some: 'payload'}; // will be urlencoded
	const res = await t.context.http.post(url, {form});
	t.same(res, obj);
});

test('http.post: Bad JSON <400>', async t => {
	const url = await listen(async (req, res) => {
		const data = await json(req);
		send(res, 200, data.nothing);
	});

	const body = '{ "bad json" }';
	t.context.http.post(url, {body}).catch(err => {
		t.same(err.statusCode, 400);
	});
});

/**
 * PUT REQUESTS
 */

test('http.put: Success <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	// use postResponse to get full Reponse object on success
	const res = await t.context.http.putResponse(url);
	t.same(res.statusCode, 200);
});

test('http.put: Bad Request <400>', async t => {
	const url = await listen(async (req, res) => send(res, 400, obj));
	t.context.http.put(url).catch(err => {
		t.same(err.statusCode, 400);
	});
});

test('http.put: JSON Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const body = {some: 'payload'};
	const res = await t.context.http.put(url, {body});
	t.same(res, obj);
});

test('http.put: Form Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const form = {some: 'payload'}; // will be urlencoded
	const res = await t.context.http.put(url, {form});
	t.same(res, obj);
});

test('http.put: Bad JSON <400>', async t => {
	const url = await listen(async (req, res) => {
		const data = await json(req);
		send(res, 200, data.nothing);
	});

	const body = '{ "bad json" }';
	t.context.http.put(url, {body}).catch(err => {
		t.same(err.statusCode, 400);
	});
});

/**
 * DELETE REQUESTS
 */

test('http.del: Success <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	// use postResponse to get full Reponse object on success
	const res = await t.context.http.delResponse(url);
	t.same(res.statusCode, 200);
});

test('http.del: Bad Request <400>', async t => {
	const url = await listen(async (req, res) => send(res, 400, obj));
	t.context.http.del(url).catch(err => {
		t.same(err.statusCode, 400);
	});
});

test('http.del: JSON Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const body = {some: 'payload'};
	const res = await t.context.http.del(url, {body});
	t.same(res, obj);
});

test('http.del: Form Object <200>', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const form = {some: 'payload'}; // will be urlencoded
	const res = await t.context.http.del(url, {form});
	t.same(res, obj);
});

test('http.del: Bad JSON <400>', async t => {
	const url = await listen(async (req, res) => {
		const data = await json(req);
		send(res, 200, data.nothing);
	});

	const body = '{ "bad json" }';
	t.context.http.del(url, {body}).catch(err => {
		t.same(err.statusCode, 400);
	});
});

/**
 * RESPONSE CODES / HANDLERS
 */

test('Response: 200 <Code>', async t => {
	const url = await listen(async (req, res) => send(res, 200));
	// Use getResponse for full data. Added to Error responses by default.
	const res = await t.context.http.getResponse(url);
	t.same(res.statusCode, 200);
});

test('Response: 301 <Code>', async t => {
	const url = await listen(async (req, res) => send(res, 301));
	t.context.http.get(url).catch(err => {
		t.same(err.statusCode, 301);
	});
});

test('Response: 404 <Code>', async t => {
	const url = await listen(async (req, res) => send(res, 404));
	t.context.http.get(url).catch(err => {
		t.same(err.statusCode, 404);
	});
});

test('Response: 404 <Object>', async t => {
	const url = await listen(async (req, res) => send(res, 404, obj));
	t.context.http.get(url).catch(err => {
		t.same(err.response.body, obj);
	});
});

test('Response: 500 <Custom>', async t => {
	const fn = async () => {
		throw new Error();
	};

	const url = await listen(fn, {
		// Server catches its own error.
		onError: async (req, res) => send(res, 200, str)
	});

	t.context.http.get(url).catch(err => {
		t.same(err.response.body, str);
		t.same(err.statusCode, 200);
	});
});
