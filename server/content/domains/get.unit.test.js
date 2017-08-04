const RoutesInfo = require('@quoin/expressjs-routes-info');
const routesInfoCache = require('@quoin/expressjs-routes-info/lib/cache');
const testHelpers = require('@quoin/node-test-helpers');

const moduleToTest = require('./get');

const expect = testHelpers.expect;

describe("lib/controllers/domains/get", () => {
    beforeEach(() => {
        routesInfoCache.reset();

        // Because it's needed by the utils basicRender()
        const routesInfo = new RoutesInfo('/foo', '/bar');
        routesInfo.route('W2:content:entity', '/');
        routesInfo.route('W2:content:home', '/home');
    });

    afterEach(() => {
        routesInfoCache.reset();
    });

    it("should expose a function with 2 params", () => {
        expect(moduleToTest).to.be.a('function').to.have.lengthOf(2);
    });

    it("should generate 406 for unknown accept", () => {
        const reqOptions = {
            headers: {
                Accept: 'unknown'
            }
        };

        const {req, res} = testHelpers.createMocks(reqOptions);

        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(406);
    });

    it("should return HTML when asking for HTML", () => {
        const reqOptions = {
            originalUrl: '/foo/',
            app: {
                get(key) {
                    if (key === 'W2:content:baseUrl') {
                        return '/bar';
                    }
                }
            },
            headers: {
                Accept: 'text/html'
            }
        };

        const {req, res} = testHelpers.createMocks(reqOptions);
        moduleToTest(req, res);

        expect(res._getStatusCode()).to.equal(200);
    });
});
