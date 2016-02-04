'use strict';
import test from '../';

test('add http context methods to Test object', async t => {
	const http = t.context.http;
	const assertion = k => {
		return t.true(http.hasOwnProperty(k) && (typeof http[k] === 'function'), `http.${k} added`);
	};

	for (let key of ['get', 'post', 'put', 'del']) {
		assertion(key);
	}
});

test('use http.get to fetch json', async t => {
	// t.plan(1);
	await t.context.http.get('http://www.google.com').then(data => {
		console.log(data);
	});
});
