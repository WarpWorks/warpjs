const backup = require('./../lib/backup');
const debug = require('debug')('W2:scripts:backup');

Promise.resolve()
    .then(() => debug("Start backup process"))
    .then(() => backup())
    .then(() => debug("Backup process completed successfully."))
    .catch((err) => console.log("Backup process error:", err))
;
