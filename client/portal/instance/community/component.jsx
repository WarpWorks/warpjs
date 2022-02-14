import PropTypes from 'prop-types';

const CommunitySection = require('./../community-section');

const Community = (props) => {
    const { community } = props;

    if (community && community.showPanel) {
        const { page } = props;

        return (
            <div className="row warpjs-secondary-bg warpjs-page-view-side-panel warpjs-page-view-community">
                <CommunitySection page={page} title="Editors" users={community._embedded.editors} />
                <CommunitySection page={page} title="Authors" users={community._embedded.authors} />
                <CommunitySection page={page} title="Contributors" users={community._embedded.contributors} />
            </div>
        );
    } else {
        return null;
    }
};

Community.propTypes = {
    community: PropTypes.any,
    page: PropTypes.any
};

module.exports = Community;
