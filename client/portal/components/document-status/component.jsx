import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormControl, InputGroup } from 'react-bootstrap';

import { NAME } from './constants';
import Definition from './definition';

const { Button, ModalContainer } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const buttons = [{
        label: "Close",
        glyph: 'remove',
        style: 'primary',
        onClick: () => props.hideModal()
    }];

    const classNames = classnames(
        'warpjs-document-status',
        `warpjs-document-status-${props.status}`
    );

    const modalTitle = props.customMessages.ContentDocumentStatusModalTitle;

    return (
        <InputGroup>
            <FormControl.Static><span className={classNames}>{props.status}</span></FormControl.Static>
            <InputGroup.Button><Button label="" glyph="info-sign" style="primary" onClick={props.showModal} /></InputGroup.Button>
            <ModalContainer id={NAME} title={modalTitle} footerButtons={buttons}>
                <Definition customMessages={props.customMessages} />
            </ModalContainer>
        </InputGroup>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    customMessages: PropTypes.object.isRequired,
    hideModal: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired
};

export default errorBoundary(Component);
