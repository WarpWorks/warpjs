import PropTypes from 'prop-types';

import Item from './../item';

const Component = (props) => {
    let content = <div className="warpjs-empty-list">No notifications found.</div>;

    if (props.items && props.items.length) {
        content = props.items.map((item) => <Item key={item.id} item={item} showDetails={props.showDetails} />);
    }

    return (
        <div className="warpjs-user-profile-notifications-items">
            {content}
        </div>
    );
};

Component.displayName = 'UserProfileNotificationsItems';

Component.propTypes = {
    items: PropTypes.array,
    showDetails: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
