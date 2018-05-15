const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./special-relationships');

const expect = testHelpers.expect;

describe("lib/core/special-relationships", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    describe("properties", () => {
        let clone;

        before(() => {
            clone = _.clone(moduleToTest);
        });

        it("should expose PARENT_CLASS as string", () => {
            expect(moduleToTest).to.have.property('PARENT_CLASS');
            expect(moduleToTest.PARENT_CLASS).to.be.a('string');
            delete clone.PARENT_CLASS;
        });

        it("should expose TARGET_ENTITY as string", () => {
            expect(moduleToTest).to.have.property('TARGET_ENTITY');
            expect(moduleToTest.TARGET_ENTITY).to.be.a('string');
            delete clone.TARGET_ENTITY;
        });

        after(() => {
            expect(clone).to.be.empty();
        });
    });
});
