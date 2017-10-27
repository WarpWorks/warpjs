const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./index');

const expect = testHelpers.expect;

describe("lib/core/encryption/index", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    [
        'compare',
        'generate'
    ].forEach((name) => {
        it(`should expose '${name}' as function`, () => {
            expect(moduleToTest).to.have.property(name);
            expect(moduleToTest[name]).to.be.a('function');
        });
    });
});
