const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./compare-ids');

const expect = testHelpers.expect;

describe("client/admin/utils/compare-ids", () => {
    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should handle no params", () => {
        const value = moduleToTest();
        expect(value).to.be.true();
    });

    it("should recognize number equal", () => {
        const value = moduleToTest(1, 1);
        expect(value).to.be.true();
    });

    it("should recognize number non-equal", () => {
        const value = moduleToTest(1, 2);
        expect(value).to.be.false();
    });

    it("should recognize string equal", () => {
        const value = moduleToTest('1', '1');
        expect(value).to.be.true();
    });

    it("should recognize string non-equal", () => {
        const value = moduleToTest('2', '1');
        expect(value).to.be.false();
    });

    it("should recognize mixt equal", () => {
        const value = moduleToTest('1', 1);
        expect(value).to.be.true();
    });

    it("should recognize mixt non-equal", () => {
        const value = moduleToTest('2', 1);
        expect(value).to.be.false();
    });
});
