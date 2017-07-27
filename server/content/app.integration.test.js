const RoutesInfo = require('@quoin/expressjs-routes-info');
const testHelpers = require('@quoin/node-test-helpers');

const testUtilsHelpers = require('./../utils.helpers.test');

const expect = testHelpers.expect;

describe("lib/app", () => {
    let app;

    beforeEach(() => {
        app = testUtilsHelpers.requestApp();
    });

    it("should start", () => {
        const url = RoutesInfo.expand('w2-app:home');
        return app.get(url)
            .then((result) => {
                expect(result.headers['content-type']).to.match(/text\/html/);
            });
    });
});
