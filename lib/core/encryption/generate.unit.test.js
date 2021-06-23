const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./generate');
const filespace = require('./_.test');

const expect = testHelpers.expect;

describe(filespace(__filename), () => {
    it("should expose a function with 1 param", () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(1);
    });

    it("should not fail with no params", () => {
        return moduleToTest().then((res) => expect(res).to.be.a('string'));
    });

    it("should encrypt with one param", () => {
        return moduleToTest('foobar')
            .then((res) => {
                expect(res).to.be.a('string');
            })
        ;
    });
});
