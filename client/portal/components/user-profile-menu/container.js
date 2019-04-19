import omit from 'lodash/omit';

import Component from './component';
import namespace from './namespace';

import * as orchestrators from './orchestrators';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => getSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    showDocuments: (url) => () => orchestrators.showDocuments(dispatch, url)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    showDocuments: dispatchProps.showDocuments(stateProps.documentsUrl),
    ...omit(ownProps, ['onClick']),
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
