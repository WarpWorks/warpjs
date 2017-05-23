const RoutesInfo = require('@quoin/expressjs-routes-info');
const testHelpers = require('@quoin/node-test-helpers');

const testUtilsHelpers = require('./../utils.helpers.test');
const utils = require('./../utils');

const expect = testHelpers.expect;

describe("lib/controllers/domain", () => {
    it("should return error when unknown", () => {
        const url = RoutesInfo.expand('w2-app:domain', { domain: 'FOO-BAR' });
        return testUtilsHelpers.requestApp()
            .get(url)
            .set('Accept', utils.HAL_CONTENT_TYPE)
            .then(
                (res) => {
                    expect(res).to.have.property('body').to.be.an('object');
                    expect(res.headers['content-type']).to.contain(utils.HAL_CONTENT_TYPE);
                },
                (err) => {
                    throw new Error("Should not have failed", err);
                }
            );
    });
});
