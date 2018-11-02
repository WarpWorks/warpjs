import PropTypes from 'prop-types';
import { Col, Glyphicon, Grid, Row } from 'react-bootstrap';

import errorBoundary from './../../../react-utils/error-boundary';
import IndividualContributionCommunity from './components/community';
import IndividualContributionTitle from './components/title';
import IndividualContributionHeader from './components/header';
import LeftRightMargin from './../../../react-utils/left-right-margin';
import PortalContent from './../../../react-utils/portal-content';

import debug from './../../debug';
const log = debug('client/portal/instance/individual-contribution/component');

const Component = (props) => {
    const pageViews = props.page.pageViews;
    const pageView = pageViews && pageViews.length ? pageViews[0] : null;
    const communities = pageView ? pageView.communities : [];
    const community = communities && communities.length ? communities[0] : null;

    const authors = community && community.authors ? community.authors : [];
    const contributors = community && community.contributors ? community.contributors : [];
    const users = [].concat(authors).concat(contributors);
    const displayedUsers = users.slice(0, 4);

    return (
        <div className="warpjs-individual-contribution-header">
            <IndividualContributionHeader />
            <IndividualContributionCommunity users={users} />
            <IndividualContributionTitle name={props.page.name} />
        </div>
    );
};
Component.displayName = 'IndividualContribution';

Component.propTypes = {
    page: PropTypes.object.isRequired
};


export default errorBoundary(Component);
