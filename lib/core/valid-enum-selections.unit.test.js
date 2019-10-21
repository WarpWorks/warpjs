const clone = require('lodash/clone');

const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./valid-enum-selections');

const expect = testHelpers.expect;

describe("lib/valid-enum-selections", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose known properties", () => {
        const aClone = clone(moduleToTest);

        testHelpers.verifyProperties(aClone, 'string', [
            'One',
            'ZeroOne',
            'ZeroMany',
            'OneMany'
        ]);

        expect(aClone).to.deep.equal({});
    });
});
