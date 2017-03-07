const testHelpers = require('node-test-helpers');

const specUtils = require('./utils.helpers.test');

const expect = testHelpers.expect;

describe("HTTP server", () => {
    it("should start", () => {
        return specUtils.requestApp()
            .get('/');
    });

    it("should not reconize unknown Accept", () => {
        return specUtils.requestApp()
            .get('/')
            .set('Accept', 'Unknown')
            .then(() => {
                throw new Error("Should have failed");
            })
            .catch((err) => {
                expect(err).to.be.an.instanceof(Error);
                expect(err.message).to.equal("Not Acceptable");
            });
    });
});
