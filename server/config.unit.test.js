const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./config');

const expect = testHelpers.expect;

describe("server/content/config", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose 'persistence'", () => {
        expect(moduleToTest).to.have.property('persistence').to.be.an('object');
    });

    describe("persistence", () => {
        let persistence;

        beforeEach(() => {
            persistence = moduleToTest.persistence;
        });

        it("should expose 'host' as a string", () => {
            expect(persistence).to.have.property('host');
            expect(persistence.host).to.be.a('string');
        });

        it("should expose 'name' as a string", () => {
            expect(persistence).to.have.property('name');
            expect(persistence.name).to.be.a('string');
        });
    });

    it("should expose 'projectPath'", () => {
        expect(moduleToTest).to.have.property('projectPath');
        expect(moduleToTest.projectPath).to.be.a('string');
    });

    it("should expose 'public'", () => {
        expect(moduleToTest).to.have.property('public');
        expect(moduleToTest.public).to.be.a('string');
    });

    it("should expose 'roles'", () => {
        expect(moduleToTest).to.have.property('roles');
        expect(moduleToTest.roles).to.be.an('object');
    });

    it("should expose 'roles.admin'", () => {
        expect(moduleToTest.roles).to.have.property('admin');
        expect(moduleToTest.roles.admin).to.be.a('string');
    });

    it("should expose 'roles.content'", () => {
        expect(moduleToTest.roles).to.have.property('content');
        expect(moduleToTest.roles.content).to.be.a('string');
    });
});
