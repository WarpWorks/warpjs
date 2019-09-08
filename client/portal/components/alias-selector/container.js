import pageHalNamespace from './../../../components/page-hal/namespace';
import Component from './component';
import namespace from './namespace';
import { orchestrators } from './flux';

// import _debug from './debug'; const debug = _debug(`container`);

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);

    const page = pageHalSubstate.pages[0];

    if (pageHalSubstate.pages && pageHalSubstate.pages.length) {
        const subState = getNamespaceSubstate(state, namespace);

        subState.currentValue = (page.aliases && page.aliases.length) ? page.aliases[0].name : null;
        subState.editValue = subState.editValue || subState.currentValue;

        return Object.freeze({
            page,
            ...subState
        });
    } else {
        return Object.freeze({});
    }
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    createAlias: (url, value) => async () => orchestrators.createAlias(dispatch, url, value),
    setEditMode: (url) => async () => orchestrators.setEditMode(dispatch, url),
    renameAlias: (url, value) => async () => orchestrators.renameAlias(dispatch, url, value),
    unsetEditMode: () => orchestrators.unsetEditMode(dispatch),
    updateEditValue: (aliases, currentValue) => (value) => orchestrators.updateEditValue(dispatch, value, aliases, currentValue)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    createAlias: dispatchProps.createAlias(stateProps.page._links.alias.href, stateProps.editValue),
    renameAlias: dispatchProps.renameAlias(stateProps.page._links.alias.href, stateProps.editValue),
    setEditMode: dispatchProps.setEditMode(stateProps.page._links.alias.href),
    updateEditValue: dispatchProps.updateEditValue(stateProps.aliases, stateProps.currentValue),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
