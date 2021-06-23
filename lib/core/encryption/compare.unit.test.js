const Promise = require('bluebird');
const testHelpers = require('@quoin/node-test-helpers');

const filespace = require('./_.test');
const generate = require('./generate');
const moduleToTest = require('./compare');

const expect = testHelpers.expect;

describe(filespace(__filename), () => {
    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').and.to.have.lengthOf(2);
    });

    it("should fail when invalid hash", () => {
        return moduleToTest('foo', 'not-encrypted')
            .then(
                (result) => testHelpers.unexpectedFlow("Should have failed", result),
                () => {} // OK
            )
        ;
    });

    it("should fail when invalid match", () => {
        return Promise.resolve()
            .then(() => generate('foo'))
            .then((encryptedPassword) => moduleToTest('bar', encryptedPassword))
            .then(
                (res) => testHelpers.unexpectedFlow("Should have failed for mismatch", res),
                () => {} // OK
            );
    });

    it("should be able to decrypt what we generate", () => {
        const clearText = 'foobar';

        return Promise.resolve()
            .then(() => generate(clearText))
            .then((encryptedPassword) => moduleToTest(clearText, encryptedPassword))
            .then(
                () => {},
                (err) => testHelpers.unexpectedFlow("Should not have failed", err)
            )
        ;
    });
});
