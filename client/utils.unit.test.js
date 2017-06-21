const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./utils');

const expect = testHelpers.expect;

describe("client/utils", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });
});
