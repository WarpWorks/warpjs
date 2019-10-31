import PropTypes from 'prop-types';

// import _debug from './debug'; const debug = _debug('component');
import BreadcrumbActionButton from './../../components/breadcrumb-action-button';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.followUrl && props.unfollowUrl) {
        const onClick = () => {
            const url = props.following ? props.unfollowUrl : props.followUrl;
            props.updateFollow(url, props.following);
        };

        const label = props.following ? 'Stop following' : 'Follow';
        const glyph = props.following ? 'remove' : 'ok';

        return (
            <BreadcrumbActionButton click={onClick} glyph={glyph} label={label} />
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

export default errorBoundary(Component);
