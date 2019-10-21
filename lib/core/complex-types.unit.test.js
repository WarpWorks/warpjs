const clone = require('lodash/clone');
const testHelpers = require('@quoin/node-test-helpers');

const ComplexTypes = require('./complex-types');

const expect = testHelpers.expect;

describe("lib/complex-types", () => {
    it("should export an object", () => {
        expect(ComplexTypes).to.be.an('object');
    });

    it("should expose known properties", () => {
        const aClone = clone(ComplexTypes);

        testHelpers.verifyProperties(aClone, 'string', [
            'Action',
            'Domain',
            'Entity',
            'BasicProperty',
            'Enumeration',
            'Literal',
            'Relationship',
            'PageView',
            'Panel',
            'SeparatorPanelItem',
            'RelationshipPanelItem',
            'BasicPropertyPanelItem',
            'EnumPanelItem',
            'TableView',
            'TableItem'
        ]);

        expect(aClone).to.deep.equal({});
    });
});
