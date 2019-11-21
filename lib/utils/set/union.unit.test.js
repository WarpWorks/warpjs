const testHelpers = require('@quoin/node-test-helpers');

const toArray = require('./to-array');
const union = require('./union');

const expect = testHelpers.expect;

describe("lib/utils/set/union", () => {
    it("should be a function with at least 2 params", () => {
        expect(union).to.have.lengthOf.least(2);
    });

    it("should return a Set", () => {
        const result = union();
        expect(result).to.be.instanceof(Set);
    });

    it("should return empty Set when no params", () => {
        const result = union();
        expect(result.size).to.equal(0);
    });

    it("should return a new set", () => {
        const originalSet = new Set([ 2, 1, 3 ]);
        const result = union(originalSet);
        expect(result).to.not.equal(originalSet);
    });

    it("should add distincts sets", () => {
        const result = union(new Set([ 2, 1, 3 ]), new Set([ 5, 4, 6 ]));
        expect(toArray(result)).to.deep.equal([ 1, 2, 3, 4, 5, 6 ]);
    });

    it("should detect non-distinct element", () => {
        const result = union(new Set([ 2, 1, 3 ]), new Set([ 4, 3, 5 ]));
        expect(toArray(result)).to.deep.equal([ 1, 2, 3, 4, 5 ]);
    });

    it("should handle more than 2 sets", () => {
        const result = union(new Set([ 2, 1, 3 ]), new Set([ 5, 4, 6 ]), new Set([ 6, 2, 7 ]), new Set([ 10, 8, 2 ]));
        expect(toArray(result)).to.deep.equal([ 1, 2, 3, 4, 5, 6, 7, 8, 10 ]);
    });
});
