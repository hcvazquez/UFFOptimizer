/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('./../common');

var Api = require('./../../').Api;


describe('Api.namedQuery() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params and return value received from request()', function() {
		var queryArgs = {
			'foo': 'bar'
		};

		var fields = [
			'*', "zzz:*"
		];

		var objCode = 'baz';

		var query = 'myQuery';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.namedQuery(objCode, query, queryArgs, fields);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode + "/" + query, queryArgs, fields, "GET");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});
});