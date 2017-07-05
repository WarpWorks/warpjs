const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./create-modal');

const expect = testHelpers.expect;

describe("client/admin/create-modal", () => {
    it("should expose a function with 4 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(4);
    });
});
