const clone = require('lodash/clone');
const testHelpers = require('@quoin/node-test-helpers');

const BasicTypes = require('./basic-types');

const expect = testHelpers.expect;

describe("lib/core/basic-types", () => {
    it("should export an object", () => {
        expect(BasicTypes).to.be.an('object');
    });

    it("should expose known properties", () => {
        const aClone = clone(BasicTypes);

        testHelpers.verifyProperties(aClone, 'string', [
            'Boolean',
            'Date',
            'File',
            'Password',
            'Number',
            'String',
            'Text'
        ]);

        testHelpers.verifyProperties(aClone, 'function', [
            'defaultValue',
            'isValid',
            'typesCheck'
        ]);

        expect(aClone).to.deep.equal({});
    });

    describe("isValid()", () => {
        const isValid = BasicTypes.isValid;

        it("should accept 1 param", () => {
            expect(isValid).to.have.lengthOf(1);
        });

        it("should recognize an existing type", () => {
            expect(isValid(BasicTypes.String)).to.be.true();
        });

        it("should not recognize an invalid type", () => {
            expect(isValid('foobar')).to.be.false();
        });
    });
});
