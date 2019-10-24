import IndividualContributionCommunity from './components/community';
import IndividualContributionTitle from './components/title';
import IndividualContributionHeader from './components/header';

// import _debug from './debug'; const debug = _debug('component');

const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const pageViews = props.page.pageViews;
    const pageView = pageViews && pageViews.length ? pageViews[0] : null;

    if (pageView && pageView.isOfStyle && pageView.isOfStyle.IndividualContribution) {
        const communities = pageView ? pageView.communities : [];
        const community = communities && communities.length ? communities[0] : null;

        const authors = community && community.authors ? community.authors : [];
        const contributors = community && community.contributors ? community.contributors : [];
        const users = [].concat(authors).concat(contributors);

        return (
            <div className="warpjs-individual-contribution-header">
                <IndividualContributionHeader />
                <IndividualContributionCommunity users={users} />
                <IndividualContributionTitle name={props.page.name} />
            </div>
        );
    } else {
        return null;
    }
};

Component.displayName = 'IndividualContribution';

Component.propTypes = {
    page: PropTypes.object.isRequired
};

export default errorBoundary(Component);
