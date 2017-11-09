const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./top-center-of-coords');

const expect = testHelpers.expect;

describe("client/portal/preview/top-center-of-coords", () => {
    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function')
            .and.to.have.lengthOf(2);
    });

    describe("no shape", () => {
        const shape = null;

        it("should find when coords in right order", () => {
            const coords = [1, 2, 3, 4];
            const value = moduleToTest(shape, coords);
            expect(value).to.deep.equal({ x: 2, y: 2 });
        });

        it("should find when coords are inversed", () => {
            const coords = [3, 4, 1, 2];
            const value = moduleToTest(shape, coords);
            expect(value).to.deep.equal({ x: 2, y: 2 });
        });
    });

    describe("rect", () => {
        const shape = 'rect';

        it("should find when coords in right order", () => {
            const coords = [1, 2, 3, 4];
            const value = moduleToTest(shape, coords);
            expect(value).to.deep.equal({ x: 2, y: 2 });
        });

        it("should find when coords are inversed", () => {
            const coords = [3, 4, 1, 2];
            const value = moduleToTest(shape, coords);
            expect(value).to.deep.equal({ x: 2, y: 2 });
        });
    });

    describe("circle", () => {
        const shape = 'circle';

        it("should find with correct coords", () => {
            const coords = [10, 10, 5];
            const value = moduleToTest(shape, coords);
            expect(value).to.deep.equal({ x: 10, y: 5 });
        });
    });

    describe("poly", () => {
        const shape = 'poly';

        it("should find with single value", () => {
            const coords = [5, 7];
            const value = moduleToTest(shape, coords);
            expect(value).to.deep.equal({ x: 5, y: 7 });
        });

        it("should find with 2 values", () => {
            const coords = [5, 7, 10, 9];
            const value = moduleToTest(shape, coords);
            expect(value).to.deep.equal({ x: 7, y: 7 });
        });
    });
});
