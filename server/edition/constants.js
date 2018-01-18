const entryPoints = {
    portal: 'portal',
    domains: 'domains',
    domain: 'domain',
    domainTypes: 'domain-types',
    instances: 'instances',
    instance: 'instance'
};

module.exports = {
    entryPoints,
    assets: {
        css: 'warpjs-edition.min.css',
        vendor: 'vendor.min.js',

        // Must match grunt/config/webpack.js' build.output.filename pattern.
        portal: `${entryPoints.portal}.min.js`,
        domains: `${entryPoints.domains}.min.js`,
        domain: `${entryPoints.domain}.min.js`,
        domainTypes: `${entryPoints.domainTypes}.min.js`,
        instances: `${entryPoints.instances}.min.js`,
        instance: `${entryPoints.instance}.min.js`
    }
};
