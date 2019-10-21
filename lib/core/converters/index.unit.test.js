const clone = require('lodash/clone');

const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./index');

const expect = testHelpers.expect;

describe("lib/core/converters/index", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose known props", () => {
        const aClone = clone(moduleToTest);

        testHelpers.verifyProperties(aClone, 'function', [
            'minMax'
        ]);

        expect(aClone).to.be.empty();
    });
});
