const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./generate-test-data');

const expect = testHelpers.expect;

describe("client/admin/rest-calls/generate-test-data", () => {
    it("should expose a function with no params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(0);
    });
});
