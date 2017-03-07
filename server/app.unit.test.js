const testHelpers = require('node-test-helpers');

const app = require('./app');

const expect = testHelpers.expect;

describe("server/app", () => {
    it("should export a function", () => {
        expect(app).to.be.a('function');
    });
});
