const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./isArrayLengthGreater');

const expect = testHelpers.expect;

describe("client/helpers/isArrayLengthGreater", () => {
    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should throw when no params", () => {
        expect(() => moduleToTest()).to.throw();
    });

    it("should be false when 'compareValue' is negative", () => {
        expect(moduleToTest([], -1)).to.be.false();
    });

    it("should be false when empty list and 0", () => {
        expect(moduleToTest([], 0)).to.be.false();
    });

    it("should be true for non-empty list and 0", () => {
        expect(moduleToTest([1], 0)).to.be.true();
    });
});
