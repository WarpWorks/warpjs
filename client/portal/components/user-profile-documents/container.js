import cloneDeep from 'lodash/cloneDeep';

import Component from './component';
import namespace from './namespace';

const NAMESPACE = namespace();

const mapStateToProps = (state, ownProps) => Object.freeze(cloneDeep(state[NAMESPACE] || {}));

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
