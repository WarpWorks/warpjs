import { selectors as pageHalSelectors, orchestrators as pageHalOrchestrators } from './../page-hal';

import Component from './component';
import namespace from './namespace';
import { orchestrators } from './flux';

// import _debug from './debug'; const debug = _debug(`container`);

const { useDispatch, useSelector } = window.WarpJS.ReactUtils;
const { getNamespaceSubstate, wrapHookContainer } = window.WarpJS.ReactUtils;

const getComponentProps = (props) => {
    const dispatch = useDispatch();

    const pageSubstate = useSelector((state) => pageHalSelectors.pageSubstate(state));

    if (pageSubstate) {
        const subState = useSelector((state) => getNamespaceSubstate(state, namespace));
        subState.currentValue = (pageSubstate.aliases && pageSubstate.aliases.length) ? pageSubstate.aliases[0].name : null;
        subState.editValue = subState.editValue || subState.currentValue;

        const url = pageSubstate._links.alias.href;

        return Object.freeze({
            page: pageSubstate,
            ...subState,
            createAlias: async () => orchestrators.createAlias(dispatch, url, subState.editValue, pageHalOrchestrators.setDirty),
            renameAlias: async () => orchestrators.renameAlias(dispatch, url, subState.editValue, pageHalOrchestrators.setDirty),
            setEditMode: async () => orchestrators.setEditMode(dispatch, url),
            unsetEditMode: async () => orchestrators.unsetEditMode(dispatch),
            updateEditValue: async (value) => orchestrators.updateEditValue(dispatch, value, subState.aliases, subState.currentValue),
            ...props
        });
    } else {
        return Object.freeze({});
    }
};

export default wrapHookContainer(Component, getComponentProps);
