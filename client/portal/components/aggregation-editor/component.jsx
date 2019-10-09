import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

import ConfigPanel from './config-panel';
import { NAME } from './constants';
import DocumentPanel from './document-panel';

// import _debug from './debug'; const debug = _debug('component');

const { ModalContainer, Spinner } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    let footerButtons = null;
    let content = <Spinner />;

    if (props.error) {
        content = <Alert bsStyle="danger">{props.error}</Alert>;
    } else if (props.showFilters) {
        footerButtons = [
            {
                label: 'Documents',
                style: 'link',
                glyph: 'th-list',
                onClick: () => props.toggleFilters()
            }
        ];

        content = <ConfigPanel associations={props.associations} filters={props.aggregationFilters} />;
    } else if (props.items) {
        footerButtons = [{
            label: 'Filters',
            style: 'link',
            glyph: 'cog',
            onClick: () => props.toggleFilters()
        }];

        if (props.entities && props.entities.length) {
            footerButtons.push(props.entities.map((entity) => ({
                label: `New ${entity.name}`,
                style: 'primary',
                onClick: () => props.createChild(entity.name)
            })));
        }

        content = <DocumentPanel items={props.items} />;
    }

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
    createChild: PropTypes.func.isRequired,
    entities: PropTypes.array,
    error: PropTypes.string,
    id: PropTypes.string.isRequired,
    items: PropTypes.array,
    onHide: PropTypes.func.isRequired,
    showFilters: PropTypes.bool,
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    toggleFilters: PropTypes.func
};

export default errorBoundary(Component);
