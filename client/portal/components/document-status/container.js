import { selectors as pageHalSelectors, orchestrators as pageHalOrchestrators } from './../page-hal';

import Component from './component';
import { orchestrators } from './flux';

// import _debug from './debug'; const debug = _debug('container');

const { useDispatch, useSelector, wrapHookContainer } = window.WarpJS.ReactUtils;

const getComponentProps = (props) => {
    const dispatch = useDispatch();

    const pageHalSubstate = useSelector((state) => pageHalSelectors.pageHalSubstate(state));
    const page = useSelector((state) => pageHalSelectors.pageSubstate(state));

    const promotions = (page && page.status && page.status.promotion)
        ? page.status.promotion.map((promotion) => ({ label: promotion.status, href: promotion._links.self.href }))
        : []
    ;

    return Object.freeze({
        customMessages: pageHalSubstate.customMessages,
        hideModal: async () => orchestrators.hideModal(dispatch, pageHalSubstate.isDirty),
        promotions: promotions.map((item) => ({
            label: item.label,
            onClick: async () => orchestrators.promote(dispatch, item, pageHalOrchestrators.setDirty)
        })),
        realStatus: page && page.status ? page.status.realStatus : '',
        showModal: async () => orchestrators.showModal(dispatch),
        status: page && page.status ? page.status.documentStatus : '',
        ...props
    });
};

export default wrapHookContainer(Component, getComponentProps);
