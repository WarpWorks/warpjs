import PropTypes from 'prop-types';

import Item from './../item';

const Component = (props) => {
    const filteredItems = props.items.filter((item) => {
        if (!props.filters) {
            return true;
        } else if (props.filters.AUTHOR && item.relnType.author) {
            return true;
        } else if (props.filters.CONTRIBUTOR && item.relnType.contributor) {
            return true;
        } else if (props.filters.FOLLOW && item.relnType.follow) {
            return true;
        } else {
            return false;
        }
    });

    const content = filteredItems.length
        ? filteredItems.map((item) => <Item key={item.id} item={item} showDetails={props.showDetails} />)
        : <div className="warpjs-empty-list">No notifications found.</div>
    ;

    return (
        <div className="warpjs-user-profile-notifications-items">
            {content}
        </div>
    );
};

Component.displayName = 'UserProfileNotificationsItems';

Component.propTypes = {
    filters: PropTypes.shape({
        AUTHOR: PropTypes.bool,
        CONTRIBUTOR: PropTypes.bool,
        FOLLOW: PropTypes.bool
    }).isRequired,
    items: PropTypes.array,
    showDetails: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
