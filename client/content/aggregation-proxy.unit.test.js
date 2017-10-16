const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./aggregation-proxy');

const expect = testHelpers.expect;

describe("client/content/aggregation-proxy", () => {
    it("should expose a class", () => {
        expect(moduleToTest).to.be.a('function').to.have.property('name');
        expect(moduleToTest.name).to.equal('AggregationProxy');
    });
});
