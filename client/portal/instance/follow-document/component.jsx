import PropTypes from 'prop-types';

const Component = (props) => {
    return (
        <span className={`warpjs-breadcrumb-action-button warpjs-breadcrumb-action-button-with-label warpjs-follow-document warpjs-follow-document-${Boolean(props.following)}`}
            onClick={() => props.updateFollow(!props.following)}
            >
            <span className="glyphicon glyphicon-ok" /> {props.following ? 'Following' : 'Follow'}
        </span>
    );
};

Component.displayName = 'FollowDocument';

Component.propTypes = {
    following: PropTypes.bool,
    updateFollow: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
