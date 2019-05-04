import PropTypes from 'prop-types';

import Items from './../items';

const Component = (props) => {
    return (
        <Items items={props.items} showDetails={props.showDetails} />
    );
};

Component.displayName = 'UserProfileNotificationsContent';

Component.propTypes = {
    items: PropTypes.array.isRequired,
    showDetails: PropTypes.func.isRequired
};


export default window.WarpJS.ReactUtils.errorBoundary(Component);
