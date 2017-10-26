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
            'auth-plugin',
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
            'folders',
            'persistence',
            'previews',
            'views'
        ]);

        testHelpers.verifyProperties(clone, 'array', [
            'plugins'
        ]);

        expect(clone).to.be.empty();
    });
});
