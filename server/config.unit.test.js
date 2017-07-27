const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./config');

const expect = testHelpers.expect;

describe("server/content/config", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose 'persistence'", () => {
        expect(moduleToTest).to.have.property('persistence').to.be.an('object');
        expect(moduleToTest.persistence).to.have.property('host').to.be.a('string');
        expect(moduleToTest.persistence).to.have.property('name').to.be.a('string');
    });

    it("should expose 'projectPath'", () => {
        expect(moduleToTest).to.have.property('projectPath').to.be.a('string');
    });

    it("should expose 'public'", () => {
        expect(moduleToTest).to.have.property('public').to.be.a('string');
    });

    it("should expose 'roles'", () => {
        expect(moduleToTest).to.have.property('roles').to.be.an('object');
    });

    it("should expose 'roles.admin'", () => {
        expect(moduleToTest.roles).to.have.property('admin').to.be.a('string');
    });

    it("should expose 'roles.content'", () => {
        expect(moduleToTest.roles).to.have.property('content').to.be.a('string');
    });
});
