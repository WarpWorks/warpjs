const cloneDeep = require('lodash/cloneDeep');
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
            clone = cloneDeep(moduleToTest);
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

        it("should have 'REMOVE_CHILD' as string", () => {
            expect(clone).to.have.property('REMOVE_CHILD');
            expect(clone.REMOVE_CHILD).to.be.a('string');
            delete clone.REMOVE_CHILD;
        });

        it("should have 'ADD_AGGREGATION' as string", () => {
            expect(clone).to.have.property('ADD_AGGREGATION');
            expect(clone.ADD_AGGREGATION).to.be.a('string');
            delete clone.ADD_AGGREGATION;
        });

        it("should have 'ADD_EMBEDDED' as string", () => {
            expect(clone).to.have.property('ADD_EMBEDDED');
            expect(clone.ADD_EMBEDDED).to.be.a('string');
            delete clone.ADD_EMBEDDED;
        });

        after(() => {
            expect(clone).to.be.empty();
        });
    });
});
