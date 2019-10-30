import { NAME } from './constants';
import Definition from './definition';

const { Button, ModalContainer } = window.WarpJS.ReactComponents;
const { FormControl, InputGroup } = window.WarpJS.ReactUtils;
const { classnames, Fragment, PropTypes } = window.WarpJS.ReactUtils;
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

    const realStatus = (props.status !== props.realStatus)
        ? (
            <Fragment>
                {' '}
                <span>({props.realStatus})</span>
            </Fragment>
        )
        : ''
    ;

    const promotions = props.promotions.map((item, index) => <Button key={index} label={item.label} glyph="triangle-right" onClick={item.onClick} title={`Change status to "${item.label}".`} />);

    return (
        <InputGroup>
            <FormControl.Static>
                <span className={classNames}>{props.status}</span>
                {realStatus}
            </FormControl.Static>
            <InputGroup.Button>
                {promotions}
                <Button label="" glyph="info-sign" style="primary" onClick={props.showModal} title="Show status definitions" />
            </InputGroup.Button>
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
    promotions: PropTypes.array.isRequired,
    realStatus: PropTypes.string.isRequired,
    showModal: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired
};

export default errorBoundary(Component);
