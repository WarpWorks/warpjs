import pageHalNamespace from './../page-hal/namespace';
import Component from './component';

// import _debug from './debug'; const debug = _debug('container');

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);

    if (pageHalSubstate.pages && pageHalSubstate.pages.length) {
        const page = pageHalSubstate.pages[0];
        if (page._links && page._links.pdfExport) {
            return {
                show: true,
                url: page._links.pdfExport.href
            };
        }
    }
    return {};
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    click: (url) => () => {
        if (url) {
            document.location.href = url;
        }
    }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    click: dispatchProps.click(stateProps.url),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
