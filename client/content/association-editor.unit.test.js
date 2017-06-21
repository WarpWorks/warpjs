const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./association-editor');

const expect = testHelpers.expect;

describe("client/content/association-editor", () => {
    it("should expose a class", () => {
        expect(moduleToTest).to.be.a('function').to.have.property('name').to.equal('WarpAssociationEditor');
    });
});
