const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./constants');

const expect = testHelpers.expect;

describe("client/portal/entity/lib/utilities/constants", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(moduleToTest);

        testHelpers.verifyProperties(clone, 'string', [
            'FIGURE_CONTAINER',
            'MAP_AREA_MODAL_CONTAINER',
            'MAP_AREA_MODAL_FLAG'
        ]);

        expect(clone).to.be.empty();
    });
});
