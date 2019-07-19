import BreadcrumbActions from './../components/breadcrumb-actions';
import * as actionCreators from './../components/follow-document/action-creators';
import launchApp from './launch-app';

export default () => {
    const pageHal = window.WarpJS.PAGE_HAL;

    if (pageHal.warpjsUser) {
        window.WarpJS.STORE.dispatch(actionCreators.initializeState(pageHal.isFollowing, pageHal._links.follow.href, pageHal._links.unfollow.href));
    } else {
        window.WarpJS.STORE.dispatch(actionCreators.initializeState(pageHal.isFollowing, '', ''));
    }

    launchApp('warpjs-breadcrumb-actions', BreadcrumbActions);
};
