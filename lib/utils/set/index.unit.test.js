const testHelpers = require('@quoin/node-test-helpers');

const index = require('./index');

const expect = testHelpers.expect;

describe("lib/utils/set/index", () => {
    it("should expose an object", () => {
        expect(index).to.be.an('object');
    });

    context("properties", () => {
        let clone;

        before(() => {
            clone = { ...index };
        });

        after(() => {
            expect(clone).to.be.empty();
        });

        [
            'clone',
            'intersection',
            'toArray',
            'union'
        ].forEach((property) => {
            it(`should expose function '${property}'`, () => {
                expect(clone).to.have.property(property);
                expect(clone[property]).to.be.a('function');
                delete clone[property];
            });
        });
    });
});
