import { DEFAULT_VERSION } from './../../../../lib/constants';
import Component from './component';
import namespace from './namespace';
import { createVersion, hide, resetVersion, show, updateVersion } from './orchestrators';
import pageHalNamespace from './../../../components/page-hal/namespace';

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
            ? pageHalSubstate.pages[0].version || DEFAULT_VERSION
            : DEFAULT_VERSION
        ;

        const versionFragments = version.split('.');
        versionFragments[versionFragments.length - 1] = (parseInt(versionFragments[versionFragments.length - 1]) || 0) + 1;
        const nextVersion = versionFragments.join('.');

        return {
            url,
            version,
            nextVersion,
            page: pageHalSubstate.pages[0],
            ...getSubstate(state, namespace)
        };
    } else {
        return {};
    }
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    show: () => show(dispatch),
    hide: () => hide(dispatch),
    createVersion: (url, nextVersion) => async () => createVersion(dispatch, url, nextVersion),
    resetVersion: () => resetVersion(dispatch),
    updateVersion: (newValue) => updateVersion(dispatch, newValue)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    createVersion: dispatchProps.createVersion(stateProps.url, stateProps.nextVersion),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
