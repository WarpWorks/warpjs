import pageHalNamespace from './../page-hal/namespace';
import Component from './component';
import namespace from './namespace';
import { orchestrators } from './flux';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);

    if (pageHalSubstate.pages && pageHalSubstate.pages.length) {
        const subState = getNamespaceSubstate(state, namespace);

        return Object.freeze({
            page: pageHalSubstate.pages[0],
            ...subState
        });
    } else {
        return Object.freeze({});
    }
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    setEditMode: () => orchestrators.setEditMode(dispatch),
    unsetEditMode: () => orchestrators.unsetEditMode(dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
