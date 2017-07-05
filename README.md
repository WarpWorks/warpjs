# WarpJS

Full stack JavaScript environment including WarpWorks code generators for MongoDB, NodeJS and Bootstrap

## Set up

    npm install --save @warp-works/warpjs

## Configuration

You can configure the different path by creating `.warp-works-warpjsrc`:

    {
      "projectPath": "../where-are-my-data",
      "public": "../where-are-my-data/public",
      "folders": {
        "w2projects": "../where-are-my-data"
      },
      "roles": {
        "admin": "admin",
        "content": "content"
      }
    }

If you are running it locally, you will want to also define:

    {
      "port": 8080,
      "mongoServer": "localhost"
    }


## Authorization middleware

You can now use

    const warpJs = require('@warp-works/warpjs');
    const warpStudio = require('@warp-works/studio');

    const PATH_TO_WARPJS = '/content';
    app.use(PATH_TO_WARPJS,
        warpJs.middlewares.canAccessAsContentManager.bind(null, 'i3cUser'),
        warpJs.app(PATH_TO_WARPJS)
    );

    const PATH_TO_STUDIO = '/admin';
    app.use(PATH_TO_STUDIO,
        warpJs.middlewares.canAccessAsAdmin.bind(null, 'i3cUser'),
        warpStudio.app(PATH_TO_STUDIO)
    );

This expect the `req` object to have the user under `req.i3cUser`, and have a
format that is:

    {
        ...,
        Roles: [{
            ...,
            label: 'content',
            ...
        }, {
            ...,
            label: 'other-role',
            ...
        }],
        ...
    }
