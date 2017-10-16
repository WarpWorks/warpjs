const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./association-targets-proxy');

const expect = testHelpers.expect;

describe("client/content/association-targets-proxy", () => {
    it("should expose a class", () => {
        expect(moduleToTest).to.be.a('function').to.have.property('name');
        expect(moduleToTest.name).to.equal('AssociationTargetsProxy');
    });
});
