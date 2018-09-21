const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const entryPoints = {
    portal: 'portal',
    domains: 'domains',
    domain: 'domain',
    domainTypes: 'domain-types',
    instances: 'instances',
    instance: 'instance',
    orphans: 'orphans'
};

function minJs(file) {
    return `${file}.min.js`;
}

module.exports = Object.freeze({
    entryPoints,

    get baseBundles() {
        return [
            `${RoutesInfo.expand('W2:app:static')}/libs/svg/svg.js`,
            `${RoutesInfo.expand('W2:app:static')}/app/${this.assets.vendor}`
        ];
    },

    getBundles(bundleName) {
        // console.log(`getBundles(${bundleName}): this.baseBundles=`, this.baseBundles);
        return this.baseBundles.concat([
            `${RoutesInfo.expand('W2:app:static')}/app/${this.assets[bundleName]}`
        ]);
    },

    assets: Object.freeze({
        css: 'warpjs-edition.min.css',
        vendor: minJs('vendor'),

        // Must match grunt/config/webpack.js' build.output.filename pattern.
        portal: minJs(entryPoints.portal),
        domains: minJs(entryPoints.domains),
        domain: minJs(entryPoints.domain),
        domainTypes: minJs(entryPoints.domainTypes),
        instances: minJs(entryPoints.instances),
        instance: minJs(entryPoints.instance),
        orphans: minJs(entryPoints.orphans),

        content: warpjsUtils.constants.assets.content.js,
        studio: warpjsUtils.constants.assets.studio.js
    })
});
