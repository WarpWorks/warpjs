import PropTypes from 'prop-types';

const ContextButton = (props) => {
    const { page, elementId, elementType, reference = {} } = props;

    if (page && page._links && page._links.inlineEdit) {
        return (
            <div className="warpjs-inline-edit warpjs-inline-edit-context"
                data-warpjs-id={elementId}
                data-warpjs-type={elementType}
                data-warpjs-url={page._links.inlineEdit.href}
                data-warpjs-reference-type={reference.type}
                data-warpjs-reference-id={reference.id}
                data-warpjs-advanced-edit-url={page._links.edit.href}
            >
                <span className="glyphicon glyphicon-pencil" />
            </div>
        );
    } else {
        return null;
    }
};

ContextButton.propTypes = {
    page: PropTypes.any,
    elementId: PropTypes.any,
    elementType: PropTypes.any,
    reference: PropTypes.any
};

module.exports = ContextButton;
