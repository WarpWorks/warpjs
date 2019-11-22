/*
 *  substate = {
 *    filters: [{ // List of aggregations with filters.
 *      id: number (aggregation id)
 *      selected: bool (injected by reducer when user clicks in one aggregation)
 *      show: bool (injected by container)
 *      items: [{ // List of entity to filter on
 *        id: number (entity id)
 *        label: string (entity filter label defined in edit)
 *        selected: bool (injected by reducer when user clicks in first level filter)
 *        showingAll: bool (injected by reducer)
 *        items: [{ // List of first level filters
 *          id: string (doc id of first level)
 *          label: string (name of first level)
 *          selected: bool (injected by reducer)
 *          expanded: bool (injected by reducer)
 *          docs: [ string ] // documents matching this first level filter
 *          items: [{ // List of second level filters
 *            id: string (doc is of second level)
 *            label: string (name of second level)
 *            selected: bool (injected by reducer)
 *            docs: [ string ] // documents matching his second level filter.
 *          }]
 *        }]
 *      }]
 *    }]
 *  };
 */

import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('flux');

const { batch } = window.WarpJS.ReactUtils;
const { actionCreator, concatenateReducers, getNamespaceAttribute, getNamespaceSubstate, namespaceKeys, setNamespaceAttribute, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'CLEAR_FILTERS',
    'EXPAND',
    'INIT',
    'SELECT_FILTER',
    'SET_SEARCH_VALUE',
    'SET_SHOWING_ALL'
]);

const byLabel = (a, b) => a.label.localeCompare(b.label);

const actionCreators = Object.freeze({
    clearFilters: () => actionCreator(actions.CLEAR_FILTERS),
    expand: (expanded, relnId, entityId, firstLevelId) => actionCreator(actions.EXPAND, { expanded, relnId, entityId, firstLevelId }),
    init: (filters, documents) => actionCreator(actions.INIT, { filters, documents }),
    selectFilter: (selected, relnId, entityId, firstLevelId, secondLevelId) => actionCreator(actions.SELECT_FILTER, { selected, relnId, entityId, firstLevelId, secondLevelId }),
    setSearchValue: (value) => actionCreator(actions.SET_SEARCH_VALUE, { value }),
    showAll: (relnId, entityId, showingAll) => actionCreator(actions.SET_SHOWING_ALL, { relnId, entityId, showingAll })
});

export const orchestrators = Object.freeze({
    clearSearchValue: (dispatch) => {
        batch(() => {
            orchestrators.setSearchValue(dispatch, '');
            orchestrators.select(dispatch);
        });
    },

    expand: (event, dispatch, expanded, relnId, entityId, firstLevelId) => {
        event.stopPropagation();
        dispatch(actionCreators.expand(expanded, relnId, entityId, firstLevelId));
    },

    init: (dispatch, allDocuments, pageFilters, filterableDocuments) => {
        const filters = pageFilters.map((pageFilter) => {
            return {
                id: pageFilter.id,
                items: pageFilter.entities.map((entity) => {
                    const filteredDocuments = filterableDocuments.filter((doc) => doc.firstLevelRelnId === entity.id);
                    const items = filteredDocuments.reduce(
                        (items, doc) => {
                            let firstLevel = items.find((item) => item.id === doc.firstLevelDocId);
                            if (!firstLevel) {
                                firstLevel = {
                                    id: doc.firstLevelDocId,
                                    label: doc.firstLevelDocName,
                                    docs: [],
                                    items: []
                                };
                                items.push(firstLevel);
                                items.sort(byLabel);
                            }

                            const alreadyAdded = firstLevel.docs.find((item) => item === doc.docId);
                            if (!alreadyAdded) {
                                firstLevel.docs.push(doc.docId);
                            }

                            if (doc.secondLevelDocId) {
                                let secondLevel = firstLevel.items.find((item) => item.id === doc.secondLevelDocId);
                                if (!secondLevel) {
                                    secondLevel = {
                                        id: doc.secondLevelDocId,
                                        label: doc.secondLevelDocName,
                                        docs: []
                                    };
                                    firstLevel.items.push(secondLevel);
                                    firstLevel.items.sort(byLabel);
                                }

                                const alreadyAdded = secondLevel.docs.find((doc) => doc === doc.docId);
                                if (!alreadyAdded) {
                                    secondLevel.docs.push(doc.docId);
                                }
                            }

                            return items;
                        },
                        []
                    );

                    return {
                        id: entity.id,
                        label: entity.label,
                        items
                    };
                })
            };
        });

        dispatch(actionCreators.init(filters, allDocuments));
    },

    select: (dispatch, selected, relnId, entityId, firstLevelId, secondLevelId) => {
        if (relnId) {
            dispatch(actionCreators.selectFilter(selected, relnId, entityId, firstLevelId, secondLevelId));
        } else {
            dispatch(actionCreators.clearFilters());
        }
    },

    showAll: (dispatch, relnId, entityId, showingAll = true) => dispatch(actionCreators.showAll(relnId, entityId, showingAll)),
    setSearchValue: (dispatch, value) => dispatch(actionCreators.setSearchValue(value))
});

export const reducers = concatenateReducers([{
    actions: [ actions.CLEAR_FILTERS ],
    reducer: (state = {}, action) => {
        const substate = selectors.substate(state);

        substate.filters.forEach((aggregation) => {
            aggregation.selected = false;

            aggregation.items.forEach((entity) => {
                entity.selected = false;

                entity.items.forEach((firstLevel) => {
                    firstLevel.selected = false;

                    firstLevel.items.forEach((secondLevel) => {
                        secondLevel.selected = false;
                    });
                });
            });
        });

        return updaters.substate(state, substate);
    }
}, {
    actions: [ actions.EXPAND ],
    reducer: (state = {}, action) => {
        const filters = selectors.attribute(state, 'filters', []);
        const aggregation = filters.find((aggregation) => aggregation.id === action.payload.relnId);
        const entity = aggregation.items.find((entity) => entity.id === action.payload.entityId);
        const firstLevel = entity.items.find((firstLevel) => firstLevel.id === action.payload.firstLevelId);
        firstLevel.expanded = action.payload.expanded;
        return updaters.attribute(state, 'filters', filters);
    }
}, {
    actions: [ actions.INIT ],
    reducer: (state = {}, action) => {
        const substate = selectors.substate(state);
        substate.initialized = true;
        substate.filters = action.payload.filters;
        substate.documents = action.payload.documents;
        return updaters.substate(state, substate);
    }
}, {
    actions: [ actions.SELECT_FILTER ],
    reducer: (state = {}, action) => {
        const substate = selectors.substate(state);
        const aggregation = substate.filters.find((aggregation) => aggregation.id === action.payload.relnId);
        const entity = aggregation.items.find((entity) => entity.id === action.payload.entityId);
        const firstLevel = entity.items.find((firstLevel) => firstLevel.id === action.payload.firstLevelId);
        if (action.payload.secondLevelId) {
            const secondLevel = firstLevel.items.find((secondLevel) => secondLevel.id === action.payload.secondLevelId);
            secondLevel.selected = action.payload.selected;
            if (secondLevel.selected) {
                firstLevel.selected = true;
            }
        } else {
            firstLevel.selected = action.payload.selected;
            firstLevel.expanded = action.payload.selected;
            firstLevel.items.forEach((secondLevel) => {
                secondLevel.selected = false;
            });
        }

        entity.selected = Boolean(entity.items.find((firstLevel) => firstLevel.selected));
        aggregation.selected = Boolean(aggregation.items.find((entity) => entity.selected));

        return updaters.substate(state, substate);
    }
}, {
    actions: [ actions.SET_SEARCH_VALUE ],
    reducer: (state = {}, action) => updaters.attribute(state, 'searchValue', action.payload.value)
}, {
    actions: [ actions.SET_SHOWING_ALL ],
    reducer: (state = {}, action) => {
        const substate = selectors.substate(state);
        const aggregation = substate.filters.find((aggregation) => aggregation.id === action.payload.relnId);
        const entity = aggregation.items.find((entity) => entity.id === action.payload.entityId);
        entity.showingAll = action.payload.showingAll;
        return updaters.substate(state, substate);
    }
}]);

export const selectors = Object.freeze({
    attribute: (state, attribute, defaultValue) => getNamespaceAttribute(state, namespace, attribute, defaultValue),
    substate: (state) => getNamespaceSubstate(state, namespace)
});

const updaters = Object.freeze({
    attribute: (state, attribute, value) => setNamespaceAttribute(state, namespace, attribute, value),
    substate: (state, substate) => setNamespaceSubstate(state, namespace, substate)
});
