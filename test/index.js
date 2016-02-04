'use strict';
import test from '../';
import {listen, send, json} from './server';
console.log(json);

const str = 'ava-http';
const obj = {a: 'b'};

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
	const url = await listen(async (req, res) => send(res, 200, str));
	// get the response by waiting
	const res = await t.context.http.get(url);
	t.same(res, str);
});

test('http.get, thennable: 200 <String>', async t => {
	// spin up the test server
	const url = await listen(async (req, res) => send(res, 200, str));
	// get the response with .then()
	t.context.http.get(url).then(res => {
		t.same(res, str);
	});
});

test('http.get: 200 <Object>)', async t => {
	const url = await listen(async (req, res) => send(res, 200, obj));
	const res = await t.context.http.get(url, {json: true});
	t.same(res, obj);
});

test('http.get, server is not async', async t => {
	const url = await listen((req, res) => send(res, 200, obj));
	const res = await t.context.http.get(url, {json: true});
	t.same(res.a, 'b');
});
