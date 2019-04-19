import PropTypes from 'prop-types';

import ComponentItem from './../item';

const Component = (props) => {
    const items = props.items.map((item) => <ComponentItem key={item.id} item={item} />);

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
    items: PropTypes.array
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
