const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./domain');

const expect = testHelpers.expect;

describe("lib/core/models/domain", () => {
    it("should expose a function", () => {
        expect(moduleToTest).to.be.a('function')
            .to.have.lengthOf(4)
            .to.have.property('name');
        expect(moduleToTest.name).to.equal('Domain');
    });
});
