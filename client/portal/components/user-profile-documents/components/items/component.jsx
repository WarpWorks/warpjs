import PropTypes from 'prop-types';

import ComponentItem from './../item';

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

    const items = filteredItems.map((item) => <ComponentItem key={item.id} item={item} />);


    const content = items.length
        ? items
        : <div className="warpjs-user-profile-documents-items-empty">No documents found.</div>
    ;

    return (
        <div className="warpjs-user-profile-documents-items">
            {content}
        </div>
    );
};

Component.displayName = 'UserProfileDocumentsItems';

Component.propTypes = {
    filters: PropTypes.shape({
        AUTHOR: PropTypes.bool,
        CONTRIBUTOR: PropTypes.bool,
        FOLLOW: PropTypes.bool,
    }).isRequired,
    items: PropTypes.array
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
