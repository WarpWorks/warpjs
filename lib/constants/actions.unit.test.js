const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./actions');

const expect = testHelpers.expect;

describe("lib/constants/actions", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    describe("properties", () => {
        let clone;

        before(() => {
            clone = _.cloneDeep(moduleToTest);
        });

        it("should have 'ADD_CAROUSEL_CHILD' as string", () => {
            expect(clone).to.have.property('ADD_CAROUSEL_CHILD');
            expect(clone.ADD_CAROUSEL_CHILD).to.be.a('string');
            delete clone.ADD_CAROUSEL_CHILD;
        });

        it("should have 'ADD_ASSOCIATION' as string", () => {
            expect(clone).to.have.property('ADD_ASSOCIATION');
            expect(clone.ADD_ASSOCIATION).to.be.a('string');
            delete clone.ADD_ASSOCIATION;
        });

        after(() => {
            expect(clone).to.be.empty();
        });
    });
});
