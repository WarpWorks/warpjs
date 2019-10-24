import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AggregationFilters from './../components/aggregation-filters';
import InlineEditButton from './../components/inline-edit-button';
import BreadcrumbActions from './../components/breadcrumb-actions';
import IndividualContributionHeader from './../components/individual-contribution-header';
import { init as pageHalInit } from './../components/page-hal/action-creators';
import PdfExportButton from './../components/pdf-export-button';
import reducers from './../components/reducers';
import UserProfileMenu, { initializeState as initializeUserProfileMenuState } from './../components/user-profile-menu';

import * as actionCreators from './../components/follow-document/action-creators';

import launchApp from './launch-app';

// import _debug from './debug'; const debug = _debug('index');

const { flattenHAL } = window.WarpJS;
const { createStore, initReactBootstrapDisplayNames } = window.WarpJS.ReactUtils;

export default ($, data) => {
    initReactBootstrapDisplayNames();

    //  eslint-disable-next-line require-atomic-updates
    window.WarpJS.STORE = createStore(reducers, {}, [], process.env.NODE_ENV === 'development');

    //  eslint-disable-next-line require-atomic-updates
    window.WarpJS.PAGE_HAL = flattenHAL(data);

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
    const INLINE_BUTTON = 'warpjs-inline-edit-button';
    const AGGREGATION_CLASS = 'warpjs-inline-aggregation';
    $(`.${INLINE_BUTTON}`).each((i, element) => {
        const warpjsId = $(element).data('warpjsId');
        const warpjsUrl = $(element).data('warpjsUrl');
        const warpjsTitle = $(element).data('warpjsPanelTitle');

        const warpjsType = $(element).hasClass(AGGREGATION_CLASS)
            ? 'aggregation'
            : null
        ;

        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={`${INLINE_BUTTON}-${i}`}>
                <InlineEditButton id={`${INLINE_BUTTON}-${i}-${warpjsId}`} url={warpjsUrl} title={warpjsTitle} type={warpjsType} />
            </Provider>,
            element
        );
    });

    // Aggregation filters
    const aggregationFiltersInput = document.getElementById('warpjs-aggregation-filters-input');
    if (aggregationFiltersInput) {
        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={`warpjs-aggregation-filters-input`}>
                <AggregationFilters section="input" />
            </Provider>,
            aggregationFiltersInput
        );
        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={`warpjs-aggregation-filters-panel`}>
                <AggregationFilters section="filters" />
            </Provider>,
            document.getElementById('warpjs-aggregation-filters-panel')
        );
    }
};
