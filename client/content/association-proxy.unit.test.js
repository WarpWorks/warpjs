const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./association-proxy');

const expect = testHelpers.expect;

describe("client/content/association-proxy", () => {
    it("should expose a class", () => {
        expect(moduleToTest).to.be.a('function')
            .to.have.property('name').to.equal('AssociationProxy');
    });
});
