import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { PropTypes, useDispatch, useSelector } = window.WarpJS.ReactUtils;
const { getNamespaceSubstate, wrapHookContainer } = window.WarpJS.ReactUtils;

const getComponentProps = (props) => {
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

    return {
        ...subState,
        closeModal: async () => orchestrators.closeModal(dispatch, props.id, subState.isDirty),
        createChild: async (entity) => orchestrators.createChild(dispatch, subState.url, entity),
        onHide: async () => orchestrators.modalClosed(dispatch, subState.isDirty),
        toggleFilters: () => orchestrators.toggleFilters(dispatch),
        ...props
    };
};

const propTypes = {
    id: PropTypes.string.isRequired
};

export default wrapHookContainer(Component, getComponentProps, propTypes);
