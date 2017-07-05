const _ = require('lodash');
const path = require('path');
const testHelpers = require('@quoin/node-test-helpers');

const config = require('./../config');
const controllers = require('./controllers');
const utils = require('./../utils');

const expect = testHelpers.expect;

describe("server/homepage/controllers", () => {
    it("should export an object", () => {
        expect(controllers).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(controllers);

        expect(clone).to.have.property('index');
        delete clone.index;

        expect(clone).to.deep.equal({});
    });

    describe("index(req, res)", () => {
        it("should refuse unknown Accept header", () => {
            const reqOptions = {
                headers: {
                    Accept: 'unknown'
                }
            };

            const {req, res} = testHelpers.createMocks(reqOptions);

            controllers.index(req, res);
            expect(res._getStatusCode()).to.equal(406);
        });

        it("should render index for html", () => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: 'text/html'
                }
            };

            const {req, res} = testHelpers.createMocks(reqOptions);
            res.app = {
                get(key) {
                    return key;
                }
            }

            controllers.index(req, res);

            expect(res._getStatusCode()).to.equal(200);
            expect(res._getRenderView()).to.equal('index');
            expect(res._getRenderData()).to.deep.equal({
                title: 'Entity',
                bundle: 'portal',
                baseUrl: 'base-url',
                staticUrl: 'static-url'
            });
        });

        // This now requires DB access.
        it.skip("should render JSON for HAL", (done) => {
            const reqOptions = {
                url: '/some/original/url',
                headers: {
                    Accept: utils.HAL_CONTENT_TYPE
                }
            };

            const {req, res} = testHelpers.createMocks(reqOptions);

            controllers.index(req, res);
            req.app = {
                get(name) {
                    if (name === 'public-folder') {
                        return path.join(config.folders.iicData, 'public');
                    }
                    return '';
                }
            };

            setTimeout(() => {
                expect(res._getStatusCode()).to.equal(200);

                const data = res._getData();

                expect(data).to.have.property('_embedded').to.be.an('object');

                done();
            }, 1000);
        });
    });
});
