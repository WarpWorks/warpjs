import pageHalNamespace from './../page-hal/namespace';

import Component from './component';
import { orchestrators } from './flux';

// import _debug from './debug'; const debug = _debug('container');

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;
const { hideModal, showModal } = orchestrators;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);

    const page = pageHalSubstate && pageHalSubstate.pages && pageHalSubstate.pages.length
        ? pageHalSubstate.pages[0]
        : null;

    const promotions = (page && page.status && page.status.promotion)
        ? page.status.promotion.map((promotion) => ({ label: promotion.status, href: promotion._links.self.href }))
        : []
    ;

    return {
        customMessages: pageHalSubstate.customMessages,
        promotions,
        realStatus: page && page.status ? page.status.realStatus : '',
        status: page && page.status ? page.status.documentStatus : ''
    };
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => hideModal(dispatch),
    promotions: (items, setDirty) => items.map((item) => ({
        label: item.label,
        onClick: async () => orchestrators.promote(dispatch, item, setDirty)
    })),
    showModal: async () => showModal(dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    promotions: dispatchProps.promotions(stateProps.promotions, ownProps.setDirty),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
