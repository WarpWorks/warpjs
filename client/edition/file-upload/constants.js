const MODAL_NAME = 'file-upload';
const MODAL_DELETE_NAME = 'file-delete';

module.exports = Object.freeze({
    MODAL_NAME,
    MODAL_DELETE_NAME,
    MODAL_SELECTOR: `[data-warpjs-modal="${MODAL_NAME}"]`,
    MODAL_DELETE_SELECTOR: `[data-warpjs-modal="${MODAL_DELETE_NAME}"]`
});
