# WarpJS

Full stack JavaScript environment including WarpWorks code generators for MongoDB, NodeJS and Bootstrap

## Set up

    npm install --save @warp-works/warpjs

## Configuration

You can configure the different path by creating `.warp-works-warpjsrc`:

    {
      "projectPath": "../where-are-my-data",
      "public": "../where-are-my-data/public",
      "roles": {
        "admin": "admin",
        "content": "content"
      }
    }

If you are running it locally, you will want to also define:

    {
      "port": 3001,
      "mongoServer": "localhost"
    }
