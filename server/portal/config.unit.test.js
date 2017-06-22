const testHelpers = require('@quoin/node-test-helpers');
const path = require('path');

const expect = testHelpers.expect;

describe("server/portal/config", () => {
    let moduleToTest;

    beforeEach(() => {
        moduleToTest = testHelpers.rewire(path.join(__dirname, 'config'));
    });

    it("should export an object", () => {
        expect(moduleToTest).to.be.an('object');
    });
});
