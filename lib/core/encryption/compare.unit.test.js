const testHelpers = require('@quoin/node-test-helpers');

const generate = require('./generate');
const moduleToTest = require('./compare');

const expect = testHelpers.expect;

describe("lib/core/encryption/compare", () => {
    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(2);
    });

    it("should fail when invalid hash", async () => {
        try {
            const result = await moduleToTest('foo', 'not-encrypted');
            testHelpers.unexpectedFlow("Should have failed", result);
        } catch (err) {
            expect(err.message).to.equal("Not a valid BCrypt hash.");
        }
    });

    it("should fail when invalid match", async () => {
        try {
            const encryptedPassword = generate('foo');
            const res = await moduleToTest('bar', encryptedPassword);
            testHelpers.unexpectedFlow("Should have failed for mismatch", res);
        } catch (err) {
            expect(err.message).to.equal("Incorrect arguments");
        }
    });

    it("should be able to decrypt what we generate", async () => {
        const clearText = 'foobar';

        try {
            const encryptedPassword = await generate(clearText);
            await moduleToTest(clearText, encryptedPassword);
        } catch (err) {
            testHelpers.unexpectedFlow("Should not have failed", err);
        }
    });
});
