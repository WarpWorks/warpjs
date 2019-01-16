const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./min-max');
const validEnumSelections = require('./../valid-enum-selections');

const expect = testHelpers.expect;

describe("lib/core/converters/min-max", () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(1);
    });

    it("should handle 'One'", () => {
        const minMax = moduleToTest(validEnumSelections.One);
        expect(minMax).to.deep.equal({ min: 1, max: 1 });
    });

    it("should handle 'ZeroOne'", () => {
        const minMax = moduleToTest(validEnumSelections.ZeroOne);
        expect(minMax).to.deep.equal({ max: 1 });
    });

    it("should handle 'ZeroMany'", () => {
        const minMax = moduleToTest(validEnumSelections.ZeroMany);
        expect(minMax).to.deep.equal({});
    });

    it("should handle 'OneMany'", () => {
        const minMax = moduleToTest(validEnumSelections.OneMany);
        expect(minMax).to.deep.equal({ min: 1 });
    });

    it("should handle unknown", () => {
        const minMax = moduleToTest('foo');
        expect(minMax).to.be.empty();
    });
});
