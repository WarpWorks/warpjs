import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import Component from './component';
import namespace from './namespace';

import * as orchestrators from './orchestrators';

const NAMESPACE = namespace();

const mapStateToProps = (state, ownProps) => Object.freeze(cloneDeep(state[NAMESPACE] || {}));

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    showDocuments: () => orchestrators.show(dispatch, ownProps.onClick)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...omit(ownProps, ['onClick']),
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
