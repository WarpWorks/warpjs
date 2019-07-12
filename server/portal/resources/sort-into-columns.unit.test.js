const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./sort-into-columns');

const expect = testHelpers.expect;

describe("server/portal/resources/sort-into-columns", () => {
    it("should expose a function", () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(2);
    });

    context("into 3 columns", () => {
        const nbOfColumns = 3;

        it("should handle 0 elements", () => {
            const input = [];
            const expected = [];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 1 element", () => {
            const input = [ 1 ];
            const expected = [ 1, null, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 2 elements", () => {
            const input = [ 1, 2 ];
            const expected = [ 1, 2, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 3 elements", () => {
            const input = [ 1, 2, 3 ];
            const expected = [ 1, 2, 3 ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 4 elements", () => {
            const input = [ 1, 2, 3, 4 ];
            const expected = [ 1, 3, 4, 2, null, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 5 elements", () => {
            const input = [ 1, 2, 3, 4, 5 ];
            const expected = [ 1, 3, 5, 2, 4, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 6 elements", () => {
            const input = [ 1, 2, 3, 4, 5, 6 ];
            const expected = [ 1, 3, 5, 2, 4, 6 ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 7 elements", () => {
            const input = [ 1, 2, 3, 4, 5, 6, 7 ];
            const expected = [ 1, 4, 6, 2, 5, 7, 3, null, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 8 elements", () => {
            const input = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
            const expected = [ 1, 4, 7, 2, 5, 8, 3, 6, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 9 elements", () => {
            const input = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
            const expected = [ 1, 4, 7, 2, 5, 8, 3, 6, 9 ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 10 elements", () => {
            const input = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
            const expected = [ 1, 5, 8, 2, 6, 9, 3, 7, 10, 4, null, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });
    });

    context("into 4 columns", () => {
        const nbOfColumns = 4;

        it("should handle 3 elements", () => {
            const input = [ 1, 2, 3 ];
            const expected = [ 1, 2, 3, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 4 elements", () => {
            const input = [ 1, 2, 3, 4 ];
            const expected = [ 1, 2, 3, 4 ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });

        it("should handle 5 elements", () => {
            const input = [ 1, 2, 3, 4, 5 ];
            const expected = [ 1, 3, 4, 5, 2, null, null, null ];

            expect(moduleToTest(input, nbOfColumns)).to.deep.equal(expected);
        });
    });
});
