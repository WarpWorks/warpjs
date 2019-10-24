import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { getNamespaceSubstate } = window.WarpJS.ReactUtils;

const Container = (props) => {
    const dispatch = useDispatch();
    const subState = useSelector((state) => getNamespaceSubstate(state, namespace));

    (subState.associations || []).forEach((association) => {
        association.addFilter = async () => orchestrators.addFilter(dispatch, association);
        association.removeFilter = async () => orchestrators.removeFilter(dispatch, association);
        association.toggleUseParent = async (checked) => orchestrators.updateFilterValue(dispatch, association, 'useParent', checked);
        association.saveFilterLabel = async (editLabel, label) => {
            if (editLabel !== label) {
                orchestrators.updateFilterValue(dispatch, association, 'label', editLabel);
            }
        };
        association.updateFilterLabel = async (label) => orchestrators.updateFilterLabel(dispatch, association, label);
    });

    (subState.items || []).forEach((item) => {
        item.goToPortal = async () => orchestrators.goToPortal(dispatch, item);
        item.remove = async () => orchestrators.removeDocument(dispatch, item);
    });

    const dispatchProps = Object.freeze({
        closeModal: async () => orchestrators.closeModal(dispatch, props.id, subState.isDirty),
        createChild: async (entity) => orchestrators.createChild(dispatch, subState.url, entity),
        onHide: async () => orchestrators.modalClosed(dispatch, subState.isDirty),
        toggleFilters: () => orchestrators.toggleFilters(dispatch)
    });

    const connectedProps = {
        ...subState,
        ...dispatchProps,
        ...props
    };

    return <Component {...connectedProps} />;
};

Container.propTypes = {
    id: PropTypes.string.isRequired
};

export default Container;
