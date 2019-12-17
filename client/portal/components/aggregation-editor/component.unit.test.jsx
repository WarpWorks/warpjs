import testHelpers from '@quoin/node-test-helpers';

import Component from './component';

const expect = testHelpers.expect;

describe("client/portal/components/aggregation-editor/component", () => {
    it("should expose a function", () => {
        expect(Component).to.be.a('function');
    });
});
