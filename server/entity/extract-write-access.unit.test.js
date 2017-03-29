const testHelpers = require('@quoin/node-test-helpers');

const extractWriteAccess = require('./extract-write-access');

const expect = testHelpers.expect;

describe("server/entity/extract-write-access", () => {
    it("should export a function", () => {
        expect(extractWriteAccess).to.be.a('function').to.have.lengthOf(5);
    });
});
