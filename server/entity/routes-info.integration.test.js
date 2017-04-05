const testHelpers = require('@quoin/node-test-helpers');

const pathInfo = require('./../path-info');
const specUtils = require('./../utils.helpers.test');
const utils = require('./../utils');

const expect = testHelpers.expect;

const baseUrl = pathInfo(pathInfo.ENTITY);

describe(`PATH ${baseUrl} --`, () => {
    describe.skip(`GET ${baseUrl} --`, () => {
        it("should fail for unknown Accept", () => {
            return specUtils.requestApp()
                .get(baseUrl)
                .set('Accept', 'unknown')
                .then(
                    testHelpers.unexpectedFlow.bind(null, "Should have got 406"),
                    specUtils.expect406
                );
        });

        it("should allow HTML", () => {
            return specUtils.requestApp()
                .get(baseUrl)
                .set('Accept', 'text/html')
                .then(
                    (res) => {
                        expect(res.text).not.to.be.empty();
                    },
                    testHelpers.unexpectedFlow.bind(null, "Should not have failed")
                );
        });

        it("should fail for HAL", () => {
            return specUtils.requestApp()
                .get(baseUrl)
                .set('Accept', utils.HAL_CONTENT_TYPE)
                .then(
                    testHelpers.unexpectedFlow.bind(null, "Should have got 406"),
                    specUtils.expect406
                );
        });
    });
});
