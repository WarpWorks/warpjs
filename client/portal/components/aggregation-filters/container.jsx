import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { pageSubstate } from './../page-hal/selectors';

import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('container');

const { getNamespaceSubstate } = window.WarpJS.ReactUtils;

const byName = (a, b) => a.name.localeCompare(b.name);

const Container = (props) => {
    const dispatch = useDispatch();
    const subState = useSelector((state) => getNamespaceSubstate(state, namespace));
    const page = useSelector((state) => pageSubstate(state));

    const pageView = page && page.pageViews && page.pageViews.length ? page.pageViews[0] : null;

    const aggregationFilters = (pageView.aggregationFilters || []).map((reln) => ({
        id: reln.id,
        entities: (reln.entities || []).map((entity) => {
            const aggregationFiltersItems = (pageView.aggregationFiltersItems || []).filter((aggregationFiltersItem) => aggregationFiltersItem.associatedDocRelnId === entity.id);

            return {
                id: entity.id,
                name: entity.label,
                items: aggregationFiltersItems.reduce(
                    (cumulator, aggregationFiltersItem) => {
                        if (entity.useParent) {
                            const foundParent = cumulator.find((item) => item.id === aggregationFiltersItem.associatedParentDocId);
                            if (foundParent) {
                                const foundChild = foundParent.items.find((item) => item.id === aggregationFiltersItem.associatedDocId);
                                if (!foundChild) {
                                    foundParent.items.push({
                                        id: aggregationFiltersItem.associatedDocId,
                                        name: aggregationFiltersItem.associatedDocName,
                                        onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.associatedParentDocId, aggregationFiltersItem.associatedDocId)
                                    });

                                    foundParent.items.sort(byName);
                                }
                            } else {
                                cumulator.push({
                                    id: aggregationFiltersItem.associatedParentDocId,
                                    name: aggregationFiltersItem.associatedParentDocName,
                                    onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.associatedParentDocId),
                                    items: [{
                                        id: aggregationFiltersItem.associatedDocId,
                                        name: aggregationFiltersItem.associatedDocName,
                                        onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.associatedParentDocId, aggregationFiltersItem.associatedDocId)
                                    }]
                                });
                                cumulator.sort(byName);
                            }
                        } else {
                            const foundChild = cumulator.find((item) => item.id === aggregationFiltersItem.associatedDocId);
                            if (!foundChild) {
                                cumulator.push({
                                    id: aggregationFiltersItem.associatedDocId,
                                    name: aggregationFiltersItem.associatedDocName,
                                    onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.associatedDocId)
                                });

                                cumulator.sort(byName);
                            }
                        }
                        return cumulator;
                    },
                    []
                )
            };
        })
    }));

    return <Component {...subState} section={props.section} aggregationFilters={aggregationFilters} />;
};

Container.propTypes = {
    section: PropTypes.oneOf([
        'input',
        'filters'
    ])
};

export default Container;
