const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./middlewares');
const {WarpJSError} = require('@warp-works/warpjs-utils');

const expect = testHelpers.expect;

const userObjectProperty = 'someUserPropertyName';

describe("lib/middlewares", () => {
    it("should expose an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(moduleToTest);

        testHelpers.verifyProperties(clone, 'function', [
            'canAccessAsAdmin',
            'canAccessAsContentManager'
        ]);

        expect(clone).to.be.empty();
    });

    describe("canAccessAsAdmin()", () => {
        const canAccessAsAdmin = moduleToTest.canAccessAsAdmin;

        it("should call next() with error if no user", () => {
            const {req, res} = testHelpers.createMocks();
            const next = testHelpers.stub();

            canAccessAsAdmin(userObjectProperty, req, res, next);

            expect(next).to.have.been.called();

            const errorArg = next.firstCall.args[0];

            expect(errorArg).to.be.instanceof(WarpJSError);
            expect(errorArg.message).to.equal("Unauthenticated user.");
        });

        it("should call next() with error if roles undefined", () => {
            const {req, res} = testHelpers.createMocks();
            req[userObjectProperty] = {}; // Fake user data.
            const next = testHelpers.stub();

            canAccessAsAdmin(userObjectProperty, req, res, next);
            expect(next).to.have.been.called();

            const errorArg = next.firstCall.args[0];
            expect(errorArg).to.be.instanceof(WarpJSError);
            expect(errorArg.message).to.equal("Unauthorized user.");
        });

        it("should call next() with error if no role", () => {
            const {req, res} = testHelpers.createMocks();
            req[userObjectProperty] = {
                Roles: []
            }; // Fake user data.
            const next = testHelpers.stub();

            canAccessAsAdmin(userObjectProperty, req, res, next);
            expect(next).to.have.been.called();

            const errorArg = next.firstCall.args[0];
            expect(errorArg).to.be.instanceof(WarpJSError);
            expect(errorArg.message).to.equal("Unauthorized user.");
        });

        it("should call next() with error if role not admin", () => {
            const {req, res} = testHelpers.createMocks();
            req[userObjectProperty] = {
                Roles: [{
                    label: "not admin"
                }]
            }; // Fake user data.
            const next = testHelpers.stub();

            canAccessAsAdmin(userObjectProperty, req, res, next);
            expect(next).to.have.been.called();

            const errorArg = next.firstCall.args[0];
            expect(errorArg).to.be.instanceof(WarpJSError);
            expect(errorArg.message).to.equal("Unauthorized user.");
        });

        it("should call next() with error if roles not admin", () => {
            const {req, res} = testHelpers.createMocks();
            req[userObjectProperty] = {
                Roles: [{
                    label: "not admin"
                }, {
                    label: "content"
                }]
            }; // Fake user data.
            const next = testHelpers.stub();

            canAccessAsAdmin(userObjectProperty, req, res, next);
            expect(next).to.have.been.called();

            const errorArg = next.firstCall.args[0];
            expect(errorArg).to.be.instanceof(WarpJSError);
            expect(errorArg.message).to.equal("Unauthorized user.");
        });

        it("should call next() without arguments when role is admin", () => {
            const {req, res} = testHelpers.createMocks();
            req[userObjectProperty] = {
                Roles: [{
                    label: "admin"
                }]
            }; // Fake user data.
            const next = testHelpers.stub();

            canAccessAsAdmin(userObjectProperty, req, res, next);
            expect(next).to.have.been.called();

            const errorArg = next.firstCall.args[0];
            expect(errorArg).to.be.undefined();
        });

        it("should call next() without arguments when at least one role is admin", () => {
            const {req, res} = testHelpers.createMocks();
            req[userObjectProperty] = {
                Roles: [{
                    label: "not-admin"
                }, {
                    label: "admin"
                }]
            }; // Fake user data.
            const next = testHelpers.stub();

            canAccessAsAdmin(userObjectProperty, req, res, next);
            expect(next).to.have.been.called();

            const errorArg = next.firstCall.args[0];
            expect(errorArg).to.be.undefined();
        });
    });

    describe("canAccessAsContentManager()", () => {
        it.skip("TODO");
    });
});
