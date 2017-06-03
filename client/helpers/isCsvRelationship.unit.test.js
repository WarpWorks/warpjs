const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./isCsvRelationship');

const expect = testHelpers.expect;

describe("client/helpers/isCsvRelationship", () => {
    it("should expose a function with 0 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(0);
    });

    it("should recognize csv style", () => {
        const value = moduleToTest.call({style: 'CSV'});
        expect(value).to.be.true();
    });

    it("should recognize non csv style", () => {
        const value = moduleToTest.call({style: 'not CSV'});
        expect(value).to.be.false();
    });
});
