const _ = require('lodash');
const hal = require('hal');
const path = require('path');
const testHelpers = require('@quoin/node-test-helpers');

const expect = testHelpers.expect;

describe("server/utils", () => {
    let moduleToTest;

    beforeEach(() => {
        moduleToTest = testHelpers.rewire(path.join(__dirname, 'utils'));
    });

    it("should export an object", () => {
        expect(moduleToTest).to.be.an('object');
    });

    it("should expose know properties", () => {
        const clone = _.clone(moduleToTest);

        expect(clone).to.have.property('HAL_CONTENT_TYPE');
        delete clone.HAL_CONTENT_TYPE;

        expect(clone).to.have.property('createResource');
        delete clone.createResource;

        expect(clone).to.have.property('sendHal');
        delete clone.sendHal;

        expect(clone).to.have.property('sendIndex');
        delete clone.sendIndex;

        expect(clone).to.have.property('urlFormat');
        delete clone.urlFormat;

        expect(clone).to.have.property('wrapWith406');
        delete clone.wrapWith406;

        expect(clone).to.have.property('sendError');
        delete clone.sendError;

        expect(clone).to.deep.equal({});
    });

    describe("HAL_CONTENT_TYPE", () => {
        it("should be a string", () => {
            expect(moduleToTest.HAL_CONTENT_TYPE).to.be.a('string');
        });
    });

    describe("createResource()", () => {
        it("should be a function with 2 params", () => {
            expect(moduleToTest.createResource)
                .to.be.a('function')
                .to.have.lengthOf(2);
        });

        it("should return an instance of hal.Resource", () => {
            const req = testHelpers.createRequest();
            const value = moduleToTest.createResource(req);
            expect(value).to.be.an.instanceOf(hal.Resource);
        });

        it("should return _links when no data", () => {
            const req = testHelpers.createRequest({
                method: 'GET',
                url: '/some/original/url'
            });
            const value = moduleToTest.createResource(req);
            expect(value.toJSON()).to.deep.equal({
                _links: {
                    self: {
                        href: '/some/original/url'
                    }
                }
            });
        });

        it("should return _links and data", () => {
            const req = testHelpers.createRequest({
                method: 'GET',
                url: '/some/original/url'
            });
            const data = { foo: 'bar' };
            const value = moduleToTest.createResource(req, data);
            expect(value.toJSON()).to.deep.equal({
                foo: 'bar',
                _links: {
                    self: {
                        href: '/some/original/url'
                    }
                }
            });
        });
    });

    describe("sendHal()", () => {
        it("should be a function with 4 params", () => {
            expect(moduleToTest.sendHal)
                .to.be.a('function')
                .to.have.lengthOf(4);
        });

        it("should call", () => {
            const {req, res} = testHelpers.createMocks({
                method: 'GET',
                url: '/some/original/url'
            }, {});
            const resource = moduleToTest.createResource(req, { foo: 'bar' });

            moduleToTest.sendHal(req, res, resource);

            expect(res.statusCode).to.equal(200);
            expect(res._headers).to.deep.equal({
                'Content-Type': moduleToTest.HAL_CONTENT_TYPE
            });

            expect(res._getData()).to.deep.equal({
                foo: 'bar',
                copyrightYear: (new Date()).getFullYear(),
                _links: {
                    self: {
                        href: '/some/original/url'
                    },
                    i3c_homepage: {
                        href: '/',
                        title: "Home page"
                    },
                    i3c_login: {
                        href: '/session',
                        title: "Login"
                    },
                    mapBrowser: {
                        href: '/map',
                        title: "Map Browser"
                    },
                    mapBrowserImage: {
                        href: '/public/iic_images/map-browser-icon.png',
                        title: "Map Browser Icon"
                    }
                }
            });
        });

        it("should have logout link when logged in", () => {
            const {req, res} = testHelpers.createMocks({
                method: 'GET',
                url: '/some/original/url'
            }, {});
            req.i3cUser = {some: 'thing'};
            const resource = moduleToTest.createResource(req, { foo: 'bar' });

            moduleToTest.sendHal(req, res, resource);

            expect(res.statusCode).to.equal(200);
            expect(res._headers).to.deep.equal({
                'Content-Type': moduleToTest.HAL_CONTENT_TYPE
            });

            expect(res._getData()).to.deep.equal({
                foo: 'bar',
                copyrightYear: (new Date()).getFullYear(),
                user: {
                    some: 'thing'
                },
                _links: {
                    self: {
                        href: '/some/original/url'
                    },
                    i3c_homepage: {
                        href: '/',
                        title: "Home page"
                    },
                    i3c_logout: {
                        href: '/session/logout',
                        title: "Logout"
                    },
                    mapBrowser: {
                        href: '/map',
                        title: "Map Browser"
                    },
                    mapBrowserImage: {
                        href: '/public/iic_images/map-browser-icon.png',
                        title: "Map Browser Icon"
                    }
                }
            });
        });

        it("should have special when `hideLoginHeader` is true", () => {
            const {req, res} = testHelpers.createMocks({
                method: 'GET',
                url: '/some/original/url'
            }, {});
            req.i3cUser = {some: 'thing'};
            const resource = moduleToTest.createResource(req, { hideLoginHeader: true });

            moduleToTest.sendHal(req, res, resource);

            expect(res.statusCode).to.equal(200);
            expect(res._headers).to.deep.equal({
                'Content-Type': moduleToTest.HAL_CONTENT_TYPE
            });

            expect(res._getData()).to.deep.equal({
                hideLoginHeader: true,
                copyrightYear: (new Date()).getFullYear(),
                user: {
                    some: 'thing'
                },
                _links: {
                    self: {
                        href: '/some/original/url'
                    },
                    i3c_homepage: {
                        href: '/',
                        title: "Home page"
                    },
                    i3c_login: {
                        href: '/session',
                        title: "Login"
                    },
                    i3c_logout: {
                        href: '/session/logout',
                        title: "Logout"
                    },
                    mapBrowser: {
                        href: '/map',
                        title: "Map Browser"
                    },
                    mapBrowserImage: {
                        href: '/public/iic_images/map-browser-icon.png',
                        title: "Map Browser Icon"
                    }
                }
            });
        });
    });

    describe("sendIndex()", () => {
        it.skip("TODO");
    });

    describe("urlFormat()", () => {
        it("should be a function with 2 params", () => {
            expect(moduleToTest.urlFormat)
                .to.be.a('function')
                .to.have.lengthOf(2);
        });

        it("should work without params", () => {
            const value = moduleToTest.urlFormat();
            expect(value).to.equal('');
        });

        it("should return path if no query", () => {
            const value = moduleToTest.urlFormat('/some/path');
            expect(value).to.equal('/some/path');
        });

        it("should return correct url with one query param", () => {
            const value = moduleToTest.urlFormat('/some/path', {hello: 'world'});
            expect(value).to.equal('/some/path?hello=world');
        });

        it("should return correct url with two query params", () => {
            const value = moduleToTest.urlFormat('/some/path', {hello: 'world', foo: 'bar'});
            expect(value).to.equal('/some/path?hello=world&foo=bar');
        });
    });

    describe("wrapWith406()", () => {
        it.skip("TODO");
    });
});
