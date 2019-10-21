const clone = require('lodash/clone');
const testHelpers = require('@quoin/node-test-helpers');

const views = require('./views');

const expect = testHelpers.expect;

describe("lib/models/views", () => {
    it("should export an object", () => {
        expect(views).to.be.an('object');
    });

    it("should expose known properties", () => {
        const aClone = clone(views);

        testHelpers.verifyProperties(aClone, 'function', [
            'Action',
            'BasicPropertyPanelItem',
            'EnumPanelItem',
            'PageView',
            'Panel',
            'PanelItem',
            'RelationshipPanelItem',
            'SeparatorPanelItem',
            'TableItem',
            'TableView'
        ]);

        expect(aClone).to.deep.equal({});
    });
});
