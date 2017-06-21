const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./utils');
const utils = require('./../server/utils');

const expect = testHelpers.expect;

function verifySettings(settings) {
    expect(settings).to.have.property('headers').to.be.an('object');
    expect(settings.headers).to.have.property('Accept').to.equal(utils.HAL_CONTENT_TYPE);
    expect(settings).to.have.property('dataType').to.be.a('string');
}

describe("client/utils", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(moduleToTest);

        testHelpers.verifyProperties(clone, 'function', [
            'ensureHalHeader',
            'getCurrentPageHAL'
        ]);

        expect(clone).to.be.empty();
    });

    describe("ensureHalHeader", () => {
        const ensureHalHeader = moduleToTest.ensureHalHeader;

        it("should have 1 param", () => {
            expect(ensureHalHeader).to.have.lengthOf(1);
        });

        it("should add headers", () => {
            const settings = {};

            ensureHalHeader(settings);
            verifySettings(settings);
            expect(settings).to.have.property('dataType').to.equal('json');
        });

        it("should add 'Accept' to existing headers", () => {
            const settings = {
                headers: {}
            };

            ensureHalHeader(settings);
            verifySettings(settings);
            expect(settings).to.have.property('dataType').to.equal('json');
        });

        it("should overwrite 'Accept'", () => {
            const settings = {
                headers: {
                    Accept: 'replace/me'
                }
            };

            ensureHalHeader(settings);
            verifySettings(settings);
            expect(settings).to.have.property('dataType').to.equal('json');
        });

        it("should not overwrite 'dataType'", () => {
            const settings = {
                headers: {
                    Accept: 'replace/me'
                },
                dataType: 'keep-me'
            };

            ensureHalHeader(settings);
            verifySettings(settings);
            expect(settings).to.have.property('dataType').to.equal('keep-me');
        });
    });

    describe("getCurrentPageHAL()", () => {
        const getCurrentPageHAL = moduleToTest.getCurrentPageHAL;

        it("should have 2 params", () => {
            expect(getCurrentPageHAL).to.have.lengthOf(2);
        });

        it("should have known structure for success", () => {
            const jq = {
                ajax(settings) {
                    settings.success('data', 'text status', {jqXHR: 'object'});
                }
            };

            return getCurrentPageHAL(jq)
                .then(
                    (res) => {
                        expect(res).to.deep.equal({
                            data: 'data',
                            textStatus: 'text status',
                            jqXHR: {
                                jqXHR: 'object'
                            }
                        });
                    },
                    testHelpers.unexpectedFlow.bind(null, "Should not fail")
                );
        });

        it("should have known structure for error", () => {
            const jq = {
                ajax(settings) {
                    settings.error({responseJSON: {some: 'response'}}, 'text status', 'some-error');
                }
            };

            return getCurrentPageHAL(jq)
                .then(
                    (res) => {
                        expect(res).to.deep.equal({
                            error: {
                                textStatus: 'text status',
                                errorThrown: 'some-error'
                            },
                            data: {
                                some: 'response'
                            }
                        });
                    },
                    testHelpers.unexpectedFlow.bind(null, "Should not fail")
                );
        });

        it("should receive 'url' if passed", () => {
            const jq = {
                ajax(settings) {
                    expect(settings).to.have.property('url').to.equal('some-url');
                    settings.success('data', 'text status', {jqXHR: 'object'});
                }
            };

            return getCurrentPageHAL(jq, 'some-url');
        });
    });
});
