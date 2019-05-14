import PropTypes from 'prop-types';

import Component from './component';
import namespace from './namespace';
import { updateFilter, updateSortBy } from './orchestrators';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => getSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateFilter: (id) => async (attribute, nextState) => updateFilter(dispatch, id, attribute, nextState),
    updateSortBy: (id) => async (event) => updateSortBy(dispatch, event)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    updateFilter: dispatchProps.updateFilter(ownProps.id),
    updateSortBy: dispatchProps.updateSortBy(ownProps.id),
    ...ownProps
});

const Container = window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);

Container.propTypes = {
    id: PropTypes.string.isRequired
};

export default Container;
