const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./routes');

const expect = testHelpers.expect;

describe("server/content/routes", () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(1);
    });
});
