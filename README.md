# WarpJS

Full stack JavaScript environment including WarpWorks code generators for MongoDB, NodeJS and Bootstrap

## Releases Notes

See [RELEASE.md](RELEASE.md).

## Usage

    npm install --save @warp-works/warpjs

To include WarpJS as part of your server, you would do something like this.

    const express = require('express');
    const warpjs = require('@warp-works/warpjs');

    const app = express();

    const staticUrlPath = '/some-static';
    const warpjsBaseUrl = '/';

    app.use(staticUrlPath, express.static(warpjs.publicFolder));
    app.use(warpjsBaseUrl, warpjs.app(warpjsBaseUrl, staticUrlPath));

    app.listen(process.env.PORT || 8080)

At the moment, don't mount WarpJS under another path than `/`. See the
[bug](https://github.com/WarpWorks/warpjs/issues/92).


## Configuration

You can configure the different path by creating `.warp-works-warpjsrc`. See the
development [configuration file](./.warp-works-warpjsrc).

