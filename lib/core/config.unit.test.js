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
            'outputPath',
            'projectPath',
            'serverStarted',
            'serverVersion',
            'public'
        ]);

        testHelpers.verifyProperties(clone, 'number', [
            'port'
        ]);

        testHelpers.verifyProperties(clone, 'object', [
            'folders',
            'persistence'
        ]);

        testHelpers.verifyProperties(clone, 'array', [
            'plugins'
        ]);

        expect(clone).to.deep.equal({});
    });
});
