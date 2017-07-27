const _ = require('lodash');
const testHelpers = require('@quoin/node-test-helpers');
const Persistence = require('@warp-works/warpjs-mongo-persistence'); // FIXME: Create a mock-persistence

const app = require('./app');

const expect = testHelpers.expect;

function verifyEachLink(expect, link) {
    expect(link).to.have.property('href').to.be.a('string');
}

function verifyHal(expect, data) {
    expect(data).to.have.property('_links').to.be.an('object');

    _.forEach(data._links, verifyEachLink.bind(null, expect));

    // We always have the copyrightYear
    expect(data).to.have.property('copyrightYear').to.equal((new Date()).getFullYear());
}

function requestApp() {
    require('@quoin/expressjs-routes-info/lib/cache').reset();
    return testHelpers.request(app(Persistence, '/test', '/static-test'));
}

function expect406(err) {
    expect(err).to.be.an.instanceof(Error);
    expect(err.message).to.equal("Not Acceptable");
}

module.exports = {
    expect406,
    requestApp,
    verifyHal
};
