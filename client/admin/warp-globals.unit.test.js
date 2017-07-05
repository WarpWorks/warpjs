const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./warp-globals');

const expect = testHelpers.expect;

describe("client/admin/warp-globals", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(moduleToTest);

        expect(clone).to.have.property('$active').to.be.an('object');
        expect(clone.$active).to.have.property('domain').not.to.be.undefined();
        delete clone.$active;

        expect(clone).to.be.empty();
    });
});
