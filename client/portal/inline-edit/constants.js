import { orchestrators as pageHalOrchestrators } from './../components/page-hal';

module.exports = Object.freeze({
    MODAL_NAME: 'warpjs-inline-edit',
    IS_DIRTY: 'warpjsIsDirty',
    get selector() {
        return `[data-warpjs-modal="${this.MODAL_NAME}"]`;
    },
    setDirty() {
        $(this.selector).data(this.IS_DIRTY, true);
    },
    onClose(modal) {
        modal = modal || $(this.selector);
        modal.on('hidden.bs.modal', () => {
            pageHalOrchestrators.refreshPage(null, modal.data(this.IS_DIRTY));
            modal.remove();
        });
    }
});
