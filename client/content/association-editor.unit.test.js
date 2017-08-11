const testHelpers = require('@quoin/node-test-helpers');

const expect = testHelpers.expect;

describe.skip("client/content/association-editor", () => {
    let moduleToTest;

    beforeEach(() => {
        moduleToTest = require('./association-editor');
    });

    it("should expose a class", () => {
        expect(moduleToTest).to.be.a('function').to.have.property('name').to.equal('WarpAssociationEditor');
    });
});
