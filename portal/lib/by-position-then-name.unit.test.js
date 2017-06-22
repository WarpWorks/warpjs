const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./by-position-then-name');

const expect = testHelpers.expect;

describe("lib/by-position-then-name", () => {
    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should throw when no params", () => {
        expect(() => moduleToTest()).to.throw();
    });

    describe("equal Position", () => {
        const Position = 1;

        it("should handle no 'name'", () => {
            const left = {Position};
            const right = {Position};
            const value = moduleToTest(left, right);

            expect(value).to.equal(0);
        });

        it("should handle left no name", () => {
            const left = {Position};
            const right = {Position, name: 'a'};
            const value = moduleToTest(left, right);

            expect(value).to.below(0);
        });

        it("should handle right no name", () => {
            const left = {Position, name: 'a'};
            const right = {Position};
            const value = moduleToTest(left, right);

            expect(value).to.above(0);
        });

        it("should handle same name", () => {
            const left = {Position, name: 'a'};
            const right = {Position, name: 'a'};
            const value = moduleToTest(left, right);

            expect(value).to.equal(0);
        });

        it("should handle left 'a', right: 'b'", () => {
            const left = {Position, name: 'a'};
            const right = {Position, name: 'b'};
            const value = moduleToTest(left, right);

            expect(value).to.below(0);
        });

        it("should handle left 'b', right: 'a'", () => {
            const left = {Position, name: 'b'};
            const right = {Position, name: 'a'};
            const value = moduleToTest(left, right);

            expect(value).to.above(0);
        });
    });

    it("should handle {null}, {1}", () => {
        const left = {Position: null};
        const right = {Position: 1};
        const value = moduleToTest(left, right);

        expect(value).to.above(0);
    });

    it("should handle {1},{null}", () => {
        const left = {Position: 1};
        const right = {Position: null};
        const value = moduleToTest(left, right);

        expect(value).to.below(0);
    });

    it("should handle {1},{2}", () => {
        const left = {Position: 1};
        const right = {Position: 2};
        const value = moduleToTest(left, right);

        expect(value).to.below(0);
    });

    it("should handle {2},{1}", () => {
        const left = {Position: 2};
        const right = {Position: 1};
        const value = moduleToTest(left, right);

        expect(value).to.above(0);
    });

    it("should handle {0},{1}", () => {
        const left = {Position: 0};
        const right = {Position: 1};
        const value = moduleToTest(left, right);

        expect(value).to.below(0);
    });

    it("should handle {1},{0}", () => {
        const left = {Position: 1};
        const right = {Position: 0};
        const value = moduleToTest(left, right);

        expect(value).to.above(0);
    });

    it("should handle negative {1},{-1}", () => {
        const left = {Position: 1};
        const right = {Position: -1};
        const value = moduleToTest(left, right);

        expect(value).to.above(0);
    });

    it("should handle negative {-5},{-1}", () => {
        const left = {Position: -5};
        const right = {Position: -1};
        const value = moduleToTest(left, right);

        expect(value).to.below(0);
    });
});
