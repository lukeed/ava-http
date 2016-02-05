# AVA-http
> Futuristic test runner... for HTTP or API endpoints.

[AVA](https://github.com/sindresorhus/ava) is a fantastic "next gen" test-runner. Hopefully you've heard about it...

Its intention, as far as I understand, is to test code & modules within a `node` environment.
So, out of the box, AVA does not support testing anything in `browser` environment.

This package aims to bridge that gap (at least a little bit) by extending AVA's `Test` class with HTTP methods.
And, in typcical AVA-fahion, you can use these HTTP methods with [promise](), [generator](), and [async]() function support. :)

## Usage

### Installation
> Note: To use `ava-http`, you must have `ava` installed already.

```
npm install --save-dev ava-http
```

```json
// package.json
{
    "name": "awesome-package",
    "scripts": {
        "test": "ava"
    },
    "devDependencies": {
        "ava": "^0.11.0",
        "ava-http": "^0.1.0"
    }
}
```

### Creating your test file

Since AVA-http is a clean extension _of_ AVA, you can simply import `test` from `ava-http` instead of `ava`. Everything will work as expected.

```js
import test from 'ava-http';

// Normal AVA test
test('foo', t => {
	// ...
    t.pass();
});

// AVA-http test
test('bar', async t => {
	const expected = /*...*/;
	const res = await t.context.http.get('http://google.com');
	t.true(typeof res === 'object');
	t.same(res, expected);
});
```

### Run it
```
npm test
```

## AVA Configuration

Please see [AVA's docs](https://github.com/sindresorhus/ava#configuration) for full information.

It is **required** to include `babel-core/register` in your AVA config.

```json
{
	"ava": {
		"require": ["babel-core/register"]
	}
}
```

## AVA-http Test Methods

The generic HTTP methods are included: [`get`, `post`, `put`, `delete`].

Each of these, used within the context of an AVA test, will return a `Promise` that can be `await`ed, `yield`ed, or `then`/`catch`'d.

Unfortunately, [for now](https://github.com/sindresorhus/ava/issues/25), the only way to inject custom methods into AVA/Test is through a `context` property.
This means that AVA-http's methods must be accessed as such:
```js
test('test name here', async t => {
	t.context.http.get(url, //...
	t.context.http.post(url, //...
	t.context.http.put(url, //...
	t.context.http.del(url, //...
});
```

Erroneous responses will always return the *full* `Response` object and should be caught with `.catch()`.

Successful responses will return the `payload` (aka, `response.body`) by default.
If you would also like the full `Response` object, exchange your `method` for `methodResponse`:
* `t.context.http.get` ==> `t.context.http.getResponse`
* `t.context.http.post` ==> `t.context.http.postResponse`
* `t.context.http.put` ==> `t.context.http.putResponse`
* `t.context.http.del` ==> `t.context.http.delResponse`

## API 
### get(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

On resolve success, returns `payload`. On error, returns full `Response` object.

### getResponse(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

Always returns full `Response` object.

### post(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

On resolve success, returns `payload`. On error, returns full `Response` object.

### postResponse(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

Always returns full `Response` object.

### put(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

On resolve success, returns `payload`. On error, returns full `Response` object.

### putResponse(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

Always returns full `Response` object.

### del(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

On resolve success, returns `payload`. On error, returns full `Response` object.

### delResponse(url[, options])

> `url`: `string`

> `options`: `object`

**Returns:** `Promise`

Always returns full `Response` object.

## Options
### form

> Type: `object`

**Default:** `{}`

An object of `key:value` pairs of formdata that will be urlencoded before reaching the server.

The request's `headers` will automatically include `'content-type': 'application/x-www-form-urlencoded'`.

This simulates sending an HTML form via normal means.

### body

> Type: `object`

**Default:** `{}`

The payload data to be sent to the server. Leave `json` as `true` to automatically stringify as JSON.

### headers

> Type: `object`

**Default:** `{}`

The request headers to send.

### params

> Type: `object`

**Default:** `{}`

An alias of `qs`.

### qs

> Type: `object`

**Default:** `{}`

The query string to append to the URL. See [this example](#passing-query-string-parameters).

### json

> Type: `boolean`

**Default:** `true`

Whether or not the response body should be parsed as JSON.

### transform

> Type: `function`

**Default:** `null`

Transform the response into a custom value with which the promise is resolved. See [here](https://github.com/request/request-promise#the-transform-function) for info.


## Examples

#### Thennables
```js
test('thennable', async t => {
	t.context.http.get('http://localhost').then(res => {
		t.same(res, {expected: 'output'});
	});
});
```

#### Async Support
```js
test('async/await', async t => {
	const res = await t.context.http.get('http://localhost');
	t.same(res, {expected: 'output'});
});
```

#### Generator Support
```js
test('generator/yield', function * (t) {
	const res = yield t.context.http.get('http://localhost');
	t.same(res, {expected: 'output'});
});
```

#### Response Headers
By default, successful responses will only yield their payloads. If you need/want to test a status code, for example, this will suffice:

```js
test('response headers', async t => {
	const res = await t.context.http.getResponse('http://localhost');
	console.log('these are the headers: ', res.headers);
	t.same(res.statusCode, 200);
});
```

#### Expecting Errors

In order to successfully expect and catch a Response Error, the test must be asserted witin the Promise's `.catch()`.

For more information, please check out Request-Promise's [excellent documentation on the Promise API](https://github.com/request/request-promise#api-in-detail).

```js
test('404 error is thrown', async t => {
	t.context.http.get('http://localhost').catch(err => {
		t.same(err.statusCode, 404);
	});
});
```

#### Posting JSON
```js
test('post json object', async t => {
	const body = {some: 'data'};
	const res = await t.context.http.post('http://localhost', {body});
	t.same(res, {expected: 'output'});
});

// or, to also assert a statusCode...
test('post json object, assert status', async t => {
	const body = {some: 'data'};
	const res = await t.context.http.postResponse('http://localhost', {body});
	t.same(res.statusCode, 201);
	t.same(res.body, {expected: 'output'});
});
```

#### Posting as a HTML Form
All data within the `form` object will be `urlencoded`, just as any normal `<form>` would!

```js
test('post like a form', async t => {
	const form = {some: 'data'}; // will be urlencoded
	const res = await t.context.http.post('http://localhost', {form});
	t.same(res, {expected: 'output'});
});
```

#### Updating an Item
```js
test('update an item', async t => {
	const body = {some: 'data'};
	const res = await t.context.http.put('http://localhost/items/2', {body});
	t.same(res, {expected: 'output'});
});
```

#### Deleting an Item
```js
test('delete an item', async t => {
	const res = await t.context.http.delResponse('http://localhost/items/2');
	t.same(res.statusCode, 200);
});

// expecting an error...
test('delete is unauthorized', async t => {
	t.context.http.del('http://localhost/items/2').catch(err => {
		t.same(err.statusCode, 401);
	});
});
```

#### Pass an Authorization Token (eg, JWT)
```js
test('delete is authorized with token', async t => {
	const headers = {
        'Authorization': 'Bearer 1234567890'
	};
	const res = t.context.http.del('http://localhost/items/2', {headers});
	t.same(res, {expected: 'output'});
});
```

#### Passing Query String Parameters
```js
test('get item with parameters', async t => {
	const params = {
		token: 'xxxxx xxxxx' // -> uri + '?token=xxxxx%20xxxxx'
	};
	const res = t.context.http.get('http://localhost', {params});
	t.same(res, {expected: 'output'});
});
```

## TODOs

- [ ] Directly import `AVA/Test` && embed methods before export -- no more `context`. (not possible atm).

>>> This will make for ideal test syntax:
>>> ```js
>>> test('name of test', t => {
>>> 	t.get(url).then();
>>> });
```

- [ ] Define a complete Micro test server, with routing
- [ ] Start-up test server on `test.before()`
- [ ] Cleanup/Remove all `const url = await ...` within tests

<div align="center">
	<br>
	<br>
	<br>
	<img src="https://cdn.rawgit.com/sindresorhus/ava/fe1cea1ca3d2c8518c0cc39ec8be592beab90558/media/logo.svg" width="200" alt="AVA">
	<br>
	<br>
</div>

## License
MIT © [Luke Edwards](https://lukeed.com) et [al](https://github.com/lukeed/ava-http/graphs/contributors)
