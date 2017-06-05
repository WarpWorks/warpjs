const testHelpers = require('@quoin/node-test-helpers');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const testUtilsHelpers = require('./../utils.helpers.test');
const utils = require('./../utils');

const expect = testHelpers.expect;

describe("lib/controllers/domain-list", () => {
    describe('home', () => {
        const url = RoutesInfo.expand('w2-app:home');

        it("should not accept unknown type", () => {
            return testUtilsHelpers.requestApp()
                .get(url)
                .set('Accept', 'unknown')
                .then(() => {
                    throw new Error("Should have failed");
                })
                .catch((err) => {
                    expect(err.response.status).to.equal(406);
                });
        });

        it("should accept html GET", () => {
            return testUtilsHelpers.requestApp()
                .get(url)
                .set('Accept', 'text/html')
                .then((result) => {
                    expect(result.statusCode).to.equal(200);
                });
        });

        it("should accept HAL GET", () => {
            return testUtilsHelpers.requestApp()
                .get(url)
                .set('Accept', utils.HAL_CONTENT_TYPE)
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
