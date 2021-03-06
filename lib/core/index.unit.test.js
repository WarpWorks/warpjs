const clone = require('lodash/clone');
const testHelpers = require('@quoin/node-test-helpers');

const index = require('./index');

const expect = testHelpers.expect;

describe("lib/core/index", () => {
    it("should be an instance", () => {
        expect(index).to.be.an.instanceof(index.constructor);
    });

    it("should expose known properties", () => {
        const aClone = clone(index);

        testHelpers.verifyProperties(aClone, 'function', [
            'createNewDomain',
            'domainFiles',
            'getAllDomains',
            'getDir',
            'getDomainByName',
            'parseSMN',
            'readDir',
            'readFile',
            'smnFiles'
        ]);

        testHelpers.verifyProperties(aClone, 'string', [
            'version'
        ]);

        testHelpers.verifyProperties(aClone, null, [
            'config',
            'coreDomain',
            'domains',
            'parent'
        ]);

        testHelpers.verifyProperties(aClone, 'object', [
            'encryption'
        ]);

        expect(aClone).to.be.empty();
    });

    describe("createNewDomain()", () => {
        it("should be a function with 3 params", () => {
            expect(index).to.have.property('createNewDomain');
            expect(index.createNewDomain).to.be.a('function').to.have.lengthOf(3);
        });

        it("should create and return a new domain", () => {
            const domain = index.createNewDomain('aName', 'aDescription', false);
            expect(domain).to.be.an.instanceof(domain.constructor);
            expect(domain.constructor.name).to.equal('Domain');
        });
    });

    describe("getAllDomains()", () => {
        it("should be a function with no params", () => {
            expect(index).to.have.property('getAllDomains');
            expect(index.getAllDomains).to.be.a('function').to.have.length(0);
        });

        it("should return `this.domains`", () => {
            expect(index.getAllDomains()).to.deep.equal(index.domains);
        });
    });

    context("getDomainByName()", () => {
        it("should be a function with 1 param", () => {
            expect(index).to.have.property('getDomainByName');
            expect(index.getDomainByName).to.be.a('function').to.have.lengthOf(1);
        });

        // Skipped because need to mock DB.
        it.skip("should fail for unknown domain", () => {
            return index.getDomainByName('foo')
                .then(
                    (domain) => testHelpers.unexpectedFlow("Should have failed"),
                    (err) => {
                        expect(err).to.have.property('message');
                        expect(err.message).to.match(/Cannot find domain 'foo'./);
                    }
                )
            ;
        });
    });

    describe("toString()", () => {
        it("should be a function with no params", () => {
            expect(index).to.have.property('toString');
            expect(index.toString).to.be.a('function').to.have.lengthOf(0);
        });

        it("should return representation", () => {
            expect(index.toString()).to.be.a('string');
        });
    });

    describe("getDir()", () => {
        it("should be a function with 2 params", () => {
            expect(index).to.have.property('getDir');
            expect(index.getDir).to.be.a('function').to.have.lengthOf(2);
        });

        it("should throw when no params", () => {
            expect(() => index.getDir()).to.throw(Error, "a");
        });

        it("should return path for 'smnDemos'", () => {
            const value = index.getDir('smnDemos');
            expect(value).to.be.a('string');
        });

        it("should return path for 'templates'", () => {
            const value = index.getDir('templates');
            expect(value).to.be.a('string');
        });

        it("should return path for 'output'", () => {
            const value = index.getDir('output');
            expect(value).to.be.a('string');
        });
    });

    describe("readFile()", () => {
        it("should be a function with 1 param", () => {
            expect(index).to.have.property('readFile');
            expect(index.readFile).to.be.a('function').to.have.lengthOf(1);
        });

        it("should throw when no params", () => {
            expect(() => index.readFile()).to.throw(Error);
        });
    });
});
