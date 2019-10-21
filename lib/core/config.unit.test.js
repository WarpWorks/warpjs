const clone = require('lodash/clone');

const testHelpers = require('@quoin/node-test-helpers');

const config = require('./config');

const expect = testHelpers.expect;

describe("lib/core/config", () => {
    it("should export an object", () => {
        expect(config).to.be.an('object');
    });

    it("should expose known properties", () => {
        const aClone = clone(config);

        testHelpers.verifyProperties(aClone, 'string', [
            'cartridgePath',
            'cookieSecret',
            'domainName',
            'outputPath',
            'projectPath',
            'serverStarted',
            'serverVersion',
            'public'
        ]);

        testHelpers.verifyProperties(aClone, 'number', [
            'port',
            'paginationSize'
        ]);

        testHelpers.verifyProperties(aClone, 'object', [
            'adminConfig',
            'folders',
            'persistence',
            'previews',
            'status',
            'views',
            'analytics',
            'pdfExport'
        ]);

        testHelpers.verifyProperties(aClone, 'array', [
            'headerItems',
            'plugins'
        ]);

        // There were added by mocha@6
        delete aClone.package;
        delete aClone.opts;
        delete aClone.diff;
        delete aClone.extension;
        delete aClone.reporter;
        delete aClone.slow;
        delete aClone.timeout;
        delete aClone.ui;

        expect(aClone).to.be.empty();
    });
});
