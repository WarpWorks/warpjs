import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

import ConfigPanel from './components/config-panel';
import { NAME } from './constants';
import DocumentPanel from './components/document-panel';

// import _debug from './debug'; const debug = _debug('component');

const { ModalContainer, Spinner } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const footerButtons = [];
    let content = <Spinner />;

    if (props.error) {
        content = <Alert bsStyle="danger">{props.error}</Alert>;
    } else if (props.showFilters) {
        footerButtons.push({
            label: 'Documents',
            style: 'link',
            glyph: 'th-list',
            onClick: () => props.toggleFilters()
        });

        content = <ConfigPanel associations={props.associations} filters={props.aggregationFilters} />;
    } else if (props.items) {
        footerButtons.push({
            label: 'Filters',
            style: 'link',
            glyph: 'cog',
            onClick: () => props.toggleFilters()
        });

        if (props.entities && props.entities.length) {
            footerButtons.push(props.entities.map((entity) => ({
                label: `New ${entity.name}`,
                style: 'primary',
                onClick: () => props.createChild(entity.name)
            })));
        }

        content = <DocumentPanel items={props.items} />;
    }

    footerButtons.push({
        label: 'Done',
        style: 'primary',
        onClick: () => props.closeModal()
    });

    return (
        <ModalContainer id={props.id} title={props.title} footerButtons={footerButtons} onHide={props.onHide}>
            {content}
        </ModalContainer>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    aggregationFilters: PropTypes.array,
    associations: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
    createChild: PropTypes.func.isRequired,
    entities: PropTypes.array,
    error: PropTypes.string,
    id: PropTypes.string.isRequired,
    items: PropTypes.array,
    onHide: PropTypes.func.isRequired,
    showFilters: PropTypes.bool,
    title: PropTypes.string.isRequired,
    toggleFilters: PropTypes.func
};

export default errorBoundary(Component);
