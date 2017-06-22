const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./isBasicProperty');

const expect = testHelpers.expect;

describe("client/helpers/isBasicProperty", () => {
    it("should expose a function with no params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(0);
    });

    it("should recognize basic property panel item", () => {
        const value = moduleToTest.call({type: 'BasicPropertyPanelItem'});
        expect(value).to.be.true();
    });

    it("should recognize non basic property panel item", () => {
        const value = moduleToTest.call({type: 'not BasicPropertyPanelItem'});
        expect(value).to.be.false();
    });
});
