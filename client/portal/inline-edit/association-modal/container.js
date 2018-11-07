import Component from './component';
import wrapContainer from './../../../react-utils/wrap-container';

const mapStateToProps = (state, ownProps) => {
};

const mapDispatchToProps = (dispatch, ownProps) => {
};

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
