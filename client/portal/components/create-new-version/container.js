import Component from './component';
import namespace from './namespace';
import { createVersion, hideModal, resetVersion, showModal, updateVersion } from './orchestrators';
import pageHalNamespace from './../page-hal/namespace';

// import _debug from './debug'; const debug = _debug('container');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getSubstate(state, pageHalNamespace);
    if (pageHalSubstate.warpjsUser &&
        pageHalSubstate.pages &&
        pageHalSubstate.pages.length &&
        pageHalSubstate.pages[0]._links &&
        pageHalSubstate.pages[0]._links.edit) {

        const url = pageHalSubstate._links && pageHalSubstate._links.createNewVersion
            ? pageHalSubstate._links.createNewVersion.href
            : null
        ;

        const version = pageHalSubstate.pages && pageHalSubstate.pages.length
            ? pageHalSubstate.pages[0].version || '1.0'
            : '1.0'
        ;

        const versionFragments = version.split('.');
        versionFragments[versionFragments.length - 1] = (parseInt(versionFragments[versionFragments.length - 1]) || 0) + 1;
        const nextVersion = versionFragments.join('.');

        return {
            url,
            version,
            nextVersion,
            ...getSubstate(state, namespace),
        };
    } else {
        return {};
    }
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    showModal: (url) => async () => showModal(dispatch, url),
    hideModal: async () => hideModal(dispatch),
    createVersion: (url, nextVersion) => async () => createVersion(dispatch, url, nextVersion),
    resetVersion: () => resetVersion(dispatch),
    updateVersion: (newValue) => updateVersion(dispatch, newValue),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    createVersion: dispatchProps.createVersion(stateProps.url, stateProps.nextVersion),
    showModal: dispatchProps.showModal(stateProps.url),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
