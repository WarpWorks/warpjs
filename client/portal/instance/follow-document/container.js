import cloneDeep from 'lodash/cloneDeep';

import Component from './component';
import _debug from './debug'; const debug = _debug('container');
import namespace from './namespace';
import * as orchestrators from './orchestrators';


const mapStateToProps = (state, ownProps) => Object.freeze(cloneDeep(state[namespace()] || {}));

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateFollow: (url, current) => orchestrators.updateFollow(dispatch, url, current)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
