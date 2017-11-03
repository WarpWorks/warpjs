const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./basic-ajax-options');

const expect = testHelpers.expect;

describe("client/proxy/basic-ajax-options", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');;
    });
});
