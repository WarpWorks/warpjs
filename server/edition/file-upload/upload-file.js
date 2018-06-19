// const debug = require('debug')('W2:edition:file-upload/upload-file');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

const SUBDIR = 'uploaded-files';

function generateUniqueName(publicDir, filename) {
    const random = uuid().split('-')[0];

    const dest = path.join(
        publicDir,
        SUBDIR,
        random.substr(0, 2),
        random.substr(2, 2),
        random.substr(4, 2),
        random.substr(6, 2) + path.extname(filename)
    );
    mkdirp.sync(path.dirname(dest));
    if (fs.existsSync(dest)) {
        return generateUniqueName(publicDir, filename);
    } else {
        return dest;
    }
}

module.exports = (req, res) => {
    const { domain } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: "File upload",
        domain
    });

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => {
                const w2projectsDir = serverUtils.getConfig().folders.w2projects;
                const publicDir = path.join(w2projectsDir, 'public');
                const dest = generateUniqueName(publicDir, req.files.file.filename);
                fs.renameSync(req.files.file.file, dest);
                const fileSubPath = dest.substr(w2projectsDir.length);
                // Make OS dependant into web path.
                return fileSubPath.split(fs.sep).join('/');
            })
            .then((webPath) => resource.link('uploadedFile', webPath))
            .then(() => serverUtils.sendHal(req, res, resource))
            .catch((err) => {
                console.error(`Error in file upload:`, err);
                serverUtils.sendErrorHal(req, res, resource, err);
            })
    });
};
