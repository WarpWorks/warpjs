import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import Component from './component';
import namespace from './namespace';
import * as orchestrators from './orchestrators';

const mapStateToProps = (state, ownProps) => {
    return Object.freeze(cloneDeep(state[namespace()]) || {});
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateFollow: (url) => (value) => orchestrators.updateFollow(dispatch, url, value)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...omit(stateProps, ['url']),
    ...dispatchProps,
    updateFollow: dispatchProps.updateFollow(stateProps.url),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
