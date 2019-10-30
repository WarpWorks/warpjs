import extend from 'lodash/extend';

import { selectors as pageHalSelectors, orchestrators as pageHalOrchestrators } from './../page-hal';

import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { useDispatch, useSelector } = window.WarpJS.ReactUtils;
const { getNamespaceSubstate, wrapHookContainer } = window.WarpJS.ReactUtils;

const getComponentProps = (props) => {
    const dispatch = useDispatch();

    const pageHalSubstate = useSelector((state) => pageHalSelectors.pageHalSubstate(state));
    const warpjsUser = useSelector((state) => pageHalSelectors.warpjsUser(state));
    const pageSubstate = useSelector((state) => pageHalSelectors.pageSubstate(state));

    if (warpjsUser &&
        pageSubstate &&
        pageSubstate._links &&
        pageSubstate._links.edit) {
        const substate = useSelector((state) => getNamespaceSubstate(state, namespace));
        const page = extend({}, pageSubstate, substate.editedValues);
        page.isDirty = pageHalSubstate.isDirty || false;

        return Object.freeze({
            page,
            ...substate,
            hideModal: async () => orchestrators.hideModal(dispatch, pageHalSubstate.isDirty),
            showModal: async () => orchestrators.showModal(dispatch),
            saveValue: async (key, value) => orchestrators.saveValue(dispatch, page._links.self.href, key, value, pageHalOrchestrators.setDirty),
            updateValue: (key, value) => orchestrators.updateValue(dispatch, key, value, pageHalOrchestrators.setDirty),
            ...props
        });
    } else {
        return Object.freeze({});
    }
};

export default wrapHookContainer(Component, getComponentProps);
