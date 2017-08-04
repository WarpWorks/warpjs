const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./index');

const expect = testHelpers.expect;

describe("server/content/index", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });
});
