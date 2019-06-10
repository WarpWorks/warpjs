import PropTypes from 'prop-types';
import React from 'react';

import And from './../and';

const Component = (props) => {
    return (
        <React.Fragment>, <And /> <span className="warpjs-individual-contribution-names-more">{props.moreUsers} more</span></React.Fragment>
    );
};

Component.displayName = 'IndividualContributionCommunityAndMore';

Component.propTypes = {
    moreUsers: PropTypes.number
};

export default Component;
