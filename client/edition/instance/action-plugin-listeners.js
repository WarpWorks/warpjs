const _ = require('lodash');

const queue = [];

function insertScriptTags($) {
    while (queue.length) {
        const src = queue.shift();

        if (!$(`script[src="${src}"]`).length) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            document.head.appendChild(script);
        }
    }
}

module.exports = ($) => {
    const debouncedScriptTagsInsert = _.debounce(insertScriptTags, 500);

    $(document).on('warpjs-add-action-plugin', function(e) {
        queue.push(e.detail.href);
        debouncedScriptTagsInsert($);
    });
};
