const cloneDeep = require('lodash/cloneDeep');
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
            clone = cloneDeep(moduleToTest);
        });

        it("should have 'actions' as object", () => {
            expect(clone).to.have.property('actions');
            expect(clone.actions).to.be.an('object');
            delete clone.actions;
        });

        describe("CORE property", () => {
            it("should have 'CORE' as object", () => {
                expect(clone).to.have.property('CORE');
                expect(clone.CORE).to.be.an('object');
            });

            it("should have 'CORE.DOMAIN' as string", () => {
            });

            after(() => {
                delete clone.CORE;
            });
        });

        context('DEFAULT_VERSION', () => {
            it("should have 'DEFAULT_VERSION' as string", () => {
                expect(clone).to.have.property('DEFAULT_VERSION');
                expect(clone.DEFAULT_VERSION).to.be.a('string');
            });

            after(() => {
                delete clone.DEFAULT_VERSION;
            });
        });

        after(() => {
            expect(clone).to.be.empty();
        });
    });
});
