import extend from 'lodash/extend';

import pageHalNamespace from './../../../components/page-hal/namespace';
import Component from './component';
import namespace from './namespace';

import { orchestrators } from './flux';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;
const { setEditMode, unsetEditMode } = orchestrators;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);

    const componentProps = {
        warpjsUser: pageHalSubstate.warpjsUser
    };

    if (pageHalSubstate.pages &&
        pageHalSubstate.pages.length) {
        componentProps.page = pageHalSubstate.pages[0];
    }

    const subState = getNamespaceSubstate(state, namespace);

    return extend({}, componentProps, subState);
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    setEditMode: () => setEditMode(dispatch),
    unsetEditMode: () => unsetEditMode(dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
