import extend from 'lodash/extend';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import Component from './component';
import { KEYS, SORT_KEYS } from './constants';
import namespace from './namespace';
import { updateFilter, updateSortBy } from './orchestrators';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => {
    const substate = getSubstate(state, namespace);
    const substateId = substate[ownProps.id] || {};

    if (!substateId.filters) {
        substateId.filters = KEYS.reduce((memo, key) => extend(memo, { [key]: true }), {});
    }

    substateId.sortBy = substateId.sortBy || SORT_KEYS.DATE;

    return substateId;
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateFilter: (id) => async (attribute, nextState) => updateFilter(dispatch, id, attribute, nextState),
    updateSortBy: (id) => async (event) => updateSortBy(dispatch, id, event)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    updateFilter: dispatchProps.updateFilter(ownProps.id),
    updateSortBy: dispatchProps.updateSortBy(ownProps.id),
    ...omit(ownProps, [ 'updateFilter', 'updateSortBy' ])
});

const Container = window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);

Container.propTypes = {
    id: PropTypes.string.isRequired,
    RenderComponent: PropTypes.element.isRequired,
    items: PropTypes.array,
    byDate: PropTypes.func.isRequired,
    byName: PropTypes.func.isRequired
};

export default Container;
