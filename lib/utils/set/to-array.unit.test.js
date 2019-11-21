const testHelpers = require('@quoin/node-test-helpers');

const toArray = require('./to-array');

const expect = testHelpers.expect;

describe("lib/utils/set/to-array", () => {
    it("should be a function with 1 param", () => {
        expect(toArray).to.have.lengthOf(1);
    });

    it("should return an Array", () => {
        const result = toArray();
        expect(result).to.be.instanceof(Array);
    });

    it("should return empty array when no params", () => {
        const result = toArray();
        expect(result).to.be.empty();
    });

    it("should sort elements when returned", () => {
        const result = toArray(new Set([ 4, 2, 6 ]));
        expect(result).to.deep.equal([ 2, 4, 6 ]);
    });
});
