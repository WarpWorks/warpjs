const testHelpers = require('@quoin/node-test-helpers');

const testUtilsHelpers = require('./utils.helpers.test');

const expect = testHelpers.expect;

describe("lib/app", () => {
    it("should start", () => {
        return testUtilsHelpers.requestApp()
            .get('/')
            .then((result) => {
                expect(result.headers['content-type']).to.match(/text\/html/);
            });
    });
});
