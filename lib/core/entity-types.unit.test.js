const clone = require('lodash/clone');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./entity-types');

const expect = testHelpers.expect;

describe("lib/core/document-types", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    describe('properties', () => {
        let aClone;

        before(() => {
            aClone = clone(moduleToTest);
        });

        it("should expose 'EMBEDDED' as string", () => {
            expect(moduleToTest).to.have.property('EMBEDDED');
            expect(moduleToTest.EMBEDDED).to.be.a('string');
            delete aClone.EMBEDDED;
        });

        it("should expose 'DOCUMENT' as string", () => {
            expect(moduleToTest).to.have.property('DOCUMENT');
            expect(moduleToTest.DOCUMENT).to.be.a('string');
            delete aClone.DOCUMENT;
        });

        after(() => {
            expect(aClone).to.be.empty();
        });
    });
});
