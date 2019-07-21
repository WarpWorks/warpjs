const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const config = require('./config');

const expect = testHelpers.expect;

describe("lib/core/config", () => {
    it("should export an object", () => {
        expect(config).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(config);

        testHelpers.verifyProperties(clone, 'string', [
            'cartridgePath',
            'cookieSecret',
            'domainName',
            'outputPath',
            'projectPath',
            'serverStarted',
            'serverVersion',
            'public'
        ]);

        testHelpers.verifyProperties(clone, 'number', [
            'port',
            'paginationSize'
        ]);

        testHelpers.verifyProperties(clone, 'object', [
            'adminConfig',
            'folders',
            'persistence',
            'previews',
            'status',
            'views',
            'analytics',
            'pdfExport'
        ]);

        testHelpers.verifyProperties(clone, 'array', [
            'headerItems',
            'plugins'
        ]);

        // There were added by mocha@6
        delete clone.package;
        delete clone.opts;
        delete clone.diff;
        delete clone.extension;
        delete clone.reporter;
        delete clone.slow;
        delete clone.timeout;
        delete clone.ui;

        expect(clone).to.be.empty();
    });
});
