const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./by-number-then-string');

const expect = testHelpers.expect;

describe("lib/utils/set/by-number-then-string", () => {
    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function');
        expect(moduleToTest).to.have.lengthOf(2);
    });

    it("should handle numbers only", () => {
        expect(moduleToTest(1, 2)).to.be.lessThan(0);
        expect(moduleToTest(2, 1)).to.be.greaterThan(0);
        expect(moduleToTest(3, 3)).to.be.equal(0);
        expect(moduleToTest(10, 1)).to.be.greaterThan(0);
    });

    it("should handler strings only", () => {
        expect(moduleToTest('a', 'b')).to.be.lessThan(0);
        expect(moduleToTest('b', 'a')).to.be.greaterThan(0);
        expect(moduleToTest('c', 'c')).to.be.equal(0);
    });

    it("should handle mix", () => {
        expect(moduleToTest(1, '1')).to.be.lessThan(0);
        expect(moduleToTest(2, '1')).to.be.lessThan(0);
        expect(moduleToTest('4', 1)).to.be.greaterThan(0);
    });
});
