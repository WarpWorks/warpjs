// import cloneDeep from 'lodash/cloneDeep';

// import * as actionCreators from './action-creators';
import Component from './component';
import wrapContainer from './../../../../../react-utils/wrap-container';




const mapStateToProps = (state, ownProps) => Object.freeze({
});

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
