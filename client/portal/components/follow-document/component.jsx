import PropTypes from 'prop-types';

// import _debug from './debug'; const debug = _debug('component');
import BreadcrumbActionButton from './../../components/breadcrumb-action-button';

const Component = (props) => {
    if (props.followUrl && props.unfollowUrl) {
        const onClick = () => {
            const url = props.following ? props.unfollowUrl : props.followUrl;
            props.updateFollow(url, props.following);
        };

        const label = props.following ? 'Stop following' : 'Follow';

        return (
            <BreadcrumbActionButton click={onClick} glyph='ok' label={label} />
        );
    } else {
        return null;
    }
};

Component.displayName = 'FollowDocument';

Component.propTypes = {
    following: PropTypes.bool.isRequired,
    followUrl: PropTypes.string.isRequired,
    unfollowUrl: PropTypes.string.isRequired,
    updateFollow: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
