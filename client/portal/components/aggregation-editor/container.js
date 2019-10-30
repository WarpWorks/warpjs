import { selectors as pageHalSelectors, orchestrators as pageHalOrchestrators } from './../page-hal';

import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { PropTypes, useDispatch, useSelector } = window.WarpJS.ReactUtils;
const { getNamespaceSubstate, wrapHookContainer } = window.WarpJS.ReactUtils;

const getComponentProps = (props) => {
    const dispatch = useDispatch();
    const pageHalSubstate = useSelector((state) => pageHalSelectors.pageHalSubstate(state));
    const subState = useSelector((state) => getNamespaceSubstate(state, namespace));

    (subState.associations || []).forEach((association) => {
        association.addFilter = async () => orchestrators.addFilter(dispatch, association, pageHalOrchestrators.setDirty);
        association.removeFilter = async () => orchestrators.removeFilter(dispatch, association, pageHalOrchestrators.setDirty);
        association.toggleUseParent = async (checked) => orchestrators.updateFilterValue(dispatch, association, 'useParent', checked);
        association.saveFilterLabel = async (editLabel, label) => {
            if (editLabel !== label) {
                orchestrators.updateFilterValue(dispatch, association, 'label', editLabel, pageHalOrchestrators.setDirty);
            }
        };
        association.updateFilterLabel = async (label) => orchestrators.updateFilterLabel(dispatch, association, label, pageHalOrchestrators.setDirty);
    });

    (subState.items || []).forEach((item) => {
        item.goToPortal = async () => orchestrators.goToPortal(dispatch, item);
        item.remove = async () => orchestrators.removeDocument(dispatch, item);
    });

    return {
        ...subState,
        closeModal: async () => orchestrators.closeModal(dispatch, props.id, pageHalSubstate.isDirty),
        createChild: async (entity) => orchestrators.createChild(dispatch, subState.url, entity),
        onHide: async () => orchestrators.modalClosed(dispatch, pageHalSubstate.isDirty),
        toggleFilters: () => orchestrators.toggleFilters(dispatch),
        ...props
    };
};

const propTypes = {
    id: PropTypes.string.isRequired
};

export default wrapHookContainer(Component, getComponentProps, propTypes);
