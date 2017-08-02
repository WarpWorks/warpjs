const RoutesInfo = require('@quoin/expressjs-routes-info');
const testHelpers = require('@quoin/node-test-helpers');
const warpjsUtils = require('@warp-works/warpjs-utils');

const testUtilsHelpers = require('./../../utils.helpers.test');

const expect = testHelpers.expect;

describe.skip("lib/controllers/domain", () => {
    let app;

    beforeEach(() => {
        app = testUtilsHelpers.requestApp();
    });

    it("should return error when unknown", () => {
        const url = RoutesInfo.expand('W2:content:domain', { domain: 'FOO-BAR' });
        return app.get(url)
            .set('Accept', warpjsUtils.constants.HAL_CONTENT_TYPE)
            .then(
                (res) => {
                    expect(res).to.have.property('body').to.be.an('object');
                    expect(res.headers['content-type']).to.contain(warpjsUtils.constants.HAL_CONTENT_TYPE);
                },
                (err) => {
                    throw new Error("Should not have failed", err);
                }
            );
    });
});
