const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./get');

const expect = testHelpers.expect;

describe("client/proxy/get", () => {
    it("should expose a function with 3 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(3);
    });
});
