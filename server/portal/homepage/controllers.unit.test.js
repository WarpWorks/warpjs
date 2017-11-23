const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');

const controllers = require('./controllers');

const expect = testHelpers.expect;

describe("server/homepage/controllers", () => {
    it("should export an object", () => {
        expect(controllers).to.be.an('object');
    });

    it("should expose known properties", () => {
        const clone = _.clone(controllers);

        expect(clone).to.have.property('index');
        delete clone.index;

        expect(clone).to.deep.equal({});
    });

    describe("index(req, res)", () => {
        it("should redirect all requests", function(done) {
            this.timeout(2500);
            const {req, res} = testHelpers.createMocks();

            controllers.index(req, res);
            setTimeout(
                () => {
                    expect(res._getStatusCode()).to.equal(302);
                    done();
                },
                100
            );
        });
    });
});
