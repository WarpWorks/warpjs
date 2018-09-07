const comingSoon = require('./../../coming-soon');

module.exports = ($, modal) => {
    modal.on('click', '[data-warpjs-action="inline-edit-language-change"]', function() {
        const newLanguage = $(this).text();
        const currentLanguageElement = $(this).closest('.dropdown').find('.dropdown-toggle .text');
        if (currentLanguageElement.text() !== newLanguage) {
            currentLanguageElement.text(newLanguage);
            comingSoon($, "Changing the language");
        }
    });
};
