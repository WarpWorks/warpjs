import omit from 'lodash/omit';

import Component from './component';
import namespace from './namespace';

import * as orchestrators from './orchestrators';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => getNamespaceSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    showDocuments: (url) => async () => orchestrators.showDocuments(dispatch, url),
    showNotifications: (url) => async => orchestrators.showNotifications(dispatch, url)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    showDocuments: dispatchProps.showDocuments(stateProps.documentsUrl),
    showNotifications: dispatchProps.showNotifications(stateProps.notificationsUrl),
    ...omit(ownProps, [ 'onClick' ])
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
