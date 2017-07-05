const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./get-domain-data');

const expect = testHelpers.expect;

describe("client/admin/rest-calls/get-domain-data", () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(1);
    });
});
