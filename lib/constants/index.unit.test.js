const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./index');

const expect = testHelpers.expect;

describe("lib/constants/index", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    describe("properties", () => {
        let clone;

        before(() => {
            clone = _.cloneDeep(moduleToTest);
        });

        it("should have 'actions' as object", () => {
            expect(clone).to.have.property('actions');
            expect(clone.actions).to.be.an('object');
            delete clone.actions;
        });

        after(() => {
            expect(clone).to.be.empty();
        });
    });
});
