import DocumentFilters from './../../../document-filters';
import ComponentItems from './../items';

const COMPONENT_NAME = 'UserProfileDocumentsContent';

const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const byDate = (documentA, documentB) => {
    const lastUpdatedA = (new Date(documentA.lastUpdated)).getTime();
    const lastUpdatedB = (new Date(documentB.lastUpdated)).getTime();
    // We want the most recent on top.
    return lastUpdatedB - lastUpdatedA;
};

const byName = (documentA, documentB) => {
    const nameA = documentA.name.toLowerCase();
    const nameB = documentB.name.toLowerCase();

    return nameA.toString().localeCompare(nameB.toString());
};

const Component = (props) => {
    return (
        <div className="warpjs-user-profile-documents-content">
            <DocumentFilters className="warpjs-user-profile-documents-content"
                id={COMPONENT_NAME} RenderComponent={ComponentItems} items={props.items}
                byDate={byDate} byName={byName}
            />
        </div>
    );
};

Component.displayName = COMPONENT_NAME;

Component.propTypes = {
    items: PropTypes.array
};

export default errorBoundary(Component);
