const routesInfo = require('@quoin/expressjs-routes-info');
const testHelpers = require('@quoin/node-test-helpers');

const specUtils = require('./../../utils.helpers.test');

const expect = testHelpers.expect;

describe.skip(`PATH homepage --`, () => {
    describe(`GET homepage --`, () => {
        it("should not recognize unknown Accept", () => {
            return specUtils.requestApp()
                .get(routesInfo.expand('homepage'))
                .set('Accept', 'Unknown')
                .then(
                    (res) => {
                        expect(res.text).not.to.be.empty();
                    },
                    specUtils.expect406
                );
        });
    });
});
