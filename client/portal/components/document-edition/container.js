import pageHalNamespace from './../page-hal/namespace';
import Component from './component';
import namespace from './namespace';
import { hideModal, showModal } from './orchestrators';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getSubstate(state, pageHalNamespace);

    if (pageHalSubstate.warpjsUser &&
        pageHalSubstate.pages &&
        pageHalSubstate.pages.length &&
        pageHalSubstate.pages[0]._links &&
        pageHalSubstate.pages[0]._links.edit) {

        const page = pageHalSubstate.pages[0];

        return {
            page,
            ...getSubstate(state, namespace),
        };

    } else {
        return {};
    }
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => hideModal(dispatch),
    showModal: async () => showModal(dispatch),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
