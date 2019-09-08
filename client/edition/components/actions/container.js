import Component from './component';

const { wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    return Object.freeze({
    });
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
