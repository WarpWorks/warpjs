import PropTypes from 'prop-types';

const Component = (props) => {
    return (
        <span className="warpjs-individual-contribution-names-item">{props.user.label}</span>
    );
};

Component.displayName = 'IndividualContributionCommunityUserName';

Component.propTypes = {
    user: PropTypes.shape({
        label: PropTypes.string
    })
};

export default Component;
