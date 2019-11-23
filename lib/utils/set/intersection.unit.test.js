const testHelpers = require('@quoin/node-test-helpers');

const intersection = require('./intersection');
const toArray = require('./to-array');

const expect = testHelpers.expect;

describe("lib/utils/set/intersection", () => {
    it("should expose a function with at least 2 params", () => {
        expect(intersection).to.be.a('function').and.to.have.lengthOf.least(2);
    });

    it("should return empty Set if no params", () => {
        const result = intersection();
        expect(result).to.be.instanceof(Set);
        expect(result.size).to.be.equal(0);
    });

    it("should return copy of Set if only 1 param", () => {
        const set = new Set([ 2, 1, 3 ]);
        const result = intersection(set);
        expect(result).to.be.instanceof(Set);
        expect(result).to.not.equal(set);
        expect(toArray(result)).to.deep.equal([ 1, 2, 3 ]);
    });

    it("should return common elements in 2 sets", () => {
        const result = intersection(new Set([ 2, 1, 3 ]), new Set([ 4, 3, 5 ]));
        expect(result).to.be.instanceof(Set);
        expect(toArray(result)).to.deep.equal([ 3 ]);

        const result2 = intersection(new Set([ 2, 1, 3, 5, 4, 6 ]), new Set([ 3, 4, 5, 6, 7 ]));
        expect(toArray(result2)).to.deep.equal([ 3, 4, 5, 6 ]);

        const result3 = intersection(new Set([ 2, 1, 3 ]), new Set([ 5, 4, 6 ]));
        expect(result3.size).to.equal(0);
    });
});
