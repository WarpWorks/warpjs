const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./add-new-association');

const expect = testHelpers.expect;

describe("client/admin/domain/add-new-association", () => {
    it("should expose a function with no params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(0);
    });
});
