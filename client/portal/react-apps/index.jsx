import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AggregationEditor from './../components/aggregation-editor';
import BreadcrumbActions from './../components/breadcrumb-actions';
import IndividualContributionHeader from './../components/individual-contribution-header';
import { init as pageHalInit } from './../components/page-hal/action-creators';
import PdfExportButton from './../components/pdf-export-button';
import reducers from './../components/reducers';
import UserProfileMenu, { initializeState as initializeUserProfileMenuState } from './../components/user-profile-menu';

import * as actionCreators from './../components/follow-document/action-creators';

import launchApp from './launch-app';

export default ($, data) => {
    window.WarpJS.ReactUtils.initReactBootstrapDisplayNames();

    //  eslint-disable-next-line require-atomic-updates
    window.WarpJS.STORE = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');

    //  eslint-disable-next-line require-atomic-updates
    window.WarpJS.PAGE_HAL = window.WarpJS.flattenHAL(data);

    window.WarpJS.STORE.dispatch(pageHalInit(window.WarpJS.PAGE_HAL));

    const pageHal = window.WarpJS.PAGE_HAL;

    if (pageHal.warpjsUser) {
        window.WarpJS.STORE.dispatch(actionCreators.initializeState(pageHal.isFollowing, pageHal._links.follow.href, pageHal._links.unfollow.href));

        if (data.myPage) {
            window.WarpJS.STORE.dispatch(initializeUserProfileMenuState(data.myPage, data._links.myDocuments.href, data._links.myNotifications.href));

            launchApp('warpjs-user-profile-menu', UserProfileMenu);
        }
    } else {
        window.WarpJS.STORE.dispatch(actionCreators.initializeState(pageHal.isFollowing, '', ''));
    }

    launchApp('warpjs-breadcrumb-actions', BreadcrumbActions);
    launchApp('warpjs-pdf-export-button', PdfExportButton);

    const individualContributionHeaderPlaceholder = document.getElementById('warpjs-individual-contribution-header-placeholder');
    if (individualContributionHeaderPlaceholder) {
        ReactDOM.render(<IndividualContributionHeader page={window.WarpJS.PAGE_HAL.pages[0]} />, individualContributionHeaderPlaceholder);
    }

    // Edit-mode
    const AGGREGATION_PLACEHOLDER = 'warpjs-inline-aggregation';
    $(`.${AGGREGATION_PLACEHOLDER}`).each((i, element) => {
        const warpjsId = $(element).data('warpjsId');
        const warpjsUrl = $(element).data('warpjsUrl');

        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={`${AGGREGATION_PLACEHOLDER}-${warpjsId}`}>
                <AggregationEditor id={warpjsId} url={warpjsUrl} />
            </Provider>,
            element
        );
    });
};
