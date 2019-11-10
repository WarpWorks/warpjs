const addChildSelection = require('./add-child-selection.hbs');
const constants = require('./../../constants');
const postAndRedirect = require('./post-and-redirect');

module.exports = ($) => {
    $('[data-warpjs-status="instance"]').on(
        'click',
        '[data-warpjs-action="add-child"]:not([disabled])',
        function() {
            const subEntities = $('[data-warpjs-sub-entity-id]', $(this).parent())
                .map(function() {
                    return {
                        id: $(this).data('warpjsSubEntityId'),
                        label: $(this).data('warpjsSubEntityLabel'),
                        name: $(this).data('warpjsSubEntityName')
                    };
                })
                .get()
            ;
            if (subEntities.length) {
                const element = this;

                $(`.${constants.HAS_POPOVER}`).popover('destroy');

                const popoverOptions = {
                    html: true,
                    placement: 'auto',
                    title: "Select type:",
                    content: addChildSelection({
                        subEntities
                    }),
                    template: constants.TEMPLATES.POPOVER_WITH_FOOTER({
                        okLabel: 'Create',
                        cancelLabel: 'Cancel'
                    }),
                    sanitize: false
                };

                $(element).addClass(constants.HAS_POPOVER);
                $(element).popover(popoverOptions);
                $(element).popover('show');

                $(`.popover.in .popover-footer [data-warpjs-action="ok"]`).on('click', function(e) {
                    const baseData = {
                        typeId: $(this).closest('.popover.in').find('.popover-content select').val()
                    };

                    postAndRedirect($, element, baseData);
                    $(element).popover('destroy');
                });

                $(`.popover.in .popover-footer [data-warpjs-action="cancel"]`).on('click', function(e) {
                    $(element).popover('destroy');
                });
            } else {
                postAndRedirect($, this);
            }
        }
    );
};
