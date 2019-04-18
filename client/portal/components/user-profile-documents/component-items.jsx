import PropTypes from 'prop-types';

import ComponentItem from './component-item';

const Component = (props) => {
    return (
        <div className="warpjs-user-profile-documents-items">
            {props.items.map((item) => <ComponentItem key={item.id} item={item} />)}
        </div>
    );
};

Component.displayName = 'UserProfileDocumentsItems';

Component.propTypes = {
    items: PropTypes.array
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
