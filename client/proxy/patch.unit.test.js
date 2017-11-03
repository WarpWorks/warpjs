const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./patch');

const expect = testHelpers.expect;

describe("client/proxy/patch", () => {
    it("should expose a function with 3 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(3);
    });
});
