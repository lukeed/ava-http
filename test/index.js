'use strict';
import test from '../';
import {listen, send, json} from './server';
console.log(json);

test('add http context methods to Test object', async t => {
	const http = t.context.http;
	const assertion = k => {
		return t.true(http.hasOwnProperty(k) && (typeof http[k] === 'function'), `http.${k} added`);
	};

	for (let key of ['get', 'post', 'put', 'del']) {
		assertion(key);
	}
});

test('http.get, await: 200 <String>', async t => {
	// spin up the test server
	const url = await listen(async (req, res) => send(res, 200, 'await'));
	// get the response by waiting
	const data = await t.context.http.get(url);
	t.same(data, 'await');
});

test('http.get, thennable: 200 <String>', async t => {
	// spin up the test server
	const url = await listen(async (req, res) => send(res, 200, 'thennable'));
	// get the response with .then()
	t.context.http.get(url).then(data => {
		t.same(data, 'thennable');
	});
});
