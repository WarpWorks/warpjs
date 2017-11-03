const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./index');

const expect = testHelpers.expect;

describe("client/content/proxy/index", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose 'get' with 3 params", () => {
        expect(moduleToTest).to.have.property('get');
        expect(moduleToTest.get).to.be.a('function').and.to.have.lengthOf(3);
    });

    it("should expose 'post' with 3 params", () => {
        expect(moduleToTest).to.have.property('post');
        expect(moduleToTest.post).to.be.a('function').and.to.have.lengthOf(3);
    });

    it("should expose 'del' with 3 params", () => {
        expect(moduleToTest).to.have.property('del');
        expect(moduleToTest.del).to.be.a('function').and.to.have.lengthOf(3);
    });

    it("should expose 'patch' with 3 params", () => {
        expect(moduleToTest).to.have.property('patch');
        expect(moduleToTest.patch).to.be.a('function').and.to.have.lengthOf(3);
    });

    it("should not expose other properties", () => {
        const clone = _.clone(moduleToTest);
        delete clone.get;
        delete clone.post;
        delete clone.del;
        delete clone.patch;

        expect(clone).to.be.empty();
    });
});
