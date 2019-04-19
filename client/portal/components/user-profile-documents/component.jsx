import PropTypes from 'prop-types';

import { NAME } from './constants';
import Content from './components/content';

// import _debug from './debug'; const debug = _debug('component');

const ModalContainer = window.WarpJS.ReactComponents.ModalContainer;
const Spinner = window.WarpJS.ReactComponents.Spinner;

const Component = (props) => {
    let content = <Spinner />;

    if (props.error) {
        content = <div className="text-danger">{props.errorMessage}</div>;
    } else if (props.documents) {
        content = <Content items={props.documents} />;
    }

    return (
        <ModalContainer className="warpjs-user-profile-documents" id={NAME} title="My Documents">
            {content}
        </ModalContainer>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    documents: PropTypes.array,
    error: PropTypes.bool,
    errorMessage: PropTypes.string
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
