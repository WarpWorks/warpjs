const testHelpers = require('@quoin/node-test-helpers');
const warpjsUtils = require('@warp-works/warpjs-utils');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const testUtilsHelpers = require('./../../utils.helpers.test');

const expect = testHelpers.expect;

describe.skip("server/content/domains/get", () => {
    describe('home', () => {
        let app;
        let url;

        beforeEach(() => {
            app = testUtilsHelpers.requestApp();
            url = RoutesInfo.expand('W2:content:home');
        });

        it("should not accept unknown type", () => {
            return app.get(url)
                .set('Accept', 'unknown')
                .then(() => {
                    throw new Error("Should have failed");
                })
                .catch((err) => {
                    expect(err.response.status).to.equal(406);
                });
        });

        it("should accept html GET", () => {
            return app.get(url)
                .set('Accept', 'text/html')
                .then((result) => {
                    expect(result.statusCode).to.equal(200);
                });
        });

        it("should accept HAL GET", () => {
            return app.get(url)
                .set('Accept', warpjsUtils.constants.HAL_CONTENT_TYPE)
                .then((result) => {
                    const body = result.body;
                    expect(result.statusCode).to.equal(200);

                    expect(body).to.have.property('_embedded').to.be.an('object');
                    expect(body._embedded).to.have.property('domains').to.be.an('array');
                    body._embedded.domains.forEach((domain) => {
                        expect(domain).to.have.property('name').to.be.a('string');
                        expect(domain).to.have.property('desc').to.be.a('string');
                    });
                });
        });
    });
});
