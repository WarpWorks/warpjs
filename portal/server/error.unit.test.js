const testHelpers = require('@quoin/node-test-helpers');

const I3CError = require('./error');

const expect = testHelpers.expect;

describe("server/error", () => {
    it("should export a class", () => {
        expect(I3CError).to.be.a('function')
            .to.have.property('name').to.equal('I3CError');
    });

    describe("new I3CError()", () => {
        it("should accept 2 params", () => {
            expect(I3CError).to.have.lengthOf(2);
        });

        it("should initialize", () => {
            const e = new I3CError("a message", {an: 'error'});
            expect(e).to.have.property('name').to.equal('I3CPortal.I3CError');
            expect(e).to.have.property('message').to.equal("a message");
            expect(e).to.have.property('stack');
            expect(e).to.have.property('originalError').to.deep.equal({an: 'error'});
        });
    });

    describe("rethrow()", () => {
        it("should expose 'rethrow()'", () => {
            expect(I3CError).to.have.property('rethrow');
        });

        it("should be a function with 3 params", () => {
            expect(I3CError.rethrow).to.be.a('function').to.have.lengthOf(3);
        });

        it("should throw new error with params", () => {
            const ErrorClass = testHelpers.stub();
            try {
                I3CError.rethrow(ErrorClass, "a message", {an: 'error'});
                expect(null).to.be.undefined();
            } catch (e) {
                expect(ErrorClass).to.have.been.called();
                expect(ErrorClass).to.have.been.calledWith("a message", {an: 'error'});
            }
        });
    });
});
