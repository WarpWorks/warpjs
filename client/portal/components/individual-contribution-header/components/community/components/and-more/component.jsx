import And from './../and';

const { Fragment, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <Fragment>, <And /> <span className="warpjs-individual-contribution-names-more">{props.moreUsers} more</span></Fragment>
    );
};

Component.displayName = 'IndividualContributionCommunityAndMore';

Component.propTypes = {
    moreUsers: PropTypes.number
};

export default Component;
