const SELECTED = 'warpjs-vocabulary-letter-selected';

module.exports = ($) => {
    $(document).on('click', '.warpjs-panel-items-vocabulary .warpjs-vocabulary-letters .warpjs-vocabulary-letter', function() {
        const vocabularyPanelItem = $(this).closest('.warpjs-panel-items-vocabulary');

        $('.warpjs-vocabulary-letters .warpjs-vocabulary-letter', vocabularyPanelItem).removeClass(SELECTED);
        $(this).addClass(SELECTED);

        $('.warpjs-vocabulary-definitions .warpjs-vocabulary-definition', vocabularyPanelItem).hide();
        $(`.warpjs-vocabulary-definitions .warpjs-vocabulary-definition[data-warpjs-letter="${$(this).data('warpjsLetter')}"]`, vocabularyPanelItem).show();
    });

    // Auto-open every first letter.
    $('.warpjs-relationship-style-Vocabulary').each((i, element) => {
        $('.warpjs-panel-items-vocabulary .warpjs-vocabulary-letters .warpjs-vocabulary-letter:first-child', element).trigger('click');
    });
};
