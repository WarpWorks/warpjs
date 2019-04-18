import PropTypes from 'prop-types';

import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('component');

const ModalContainer = window.WarpJS.ReactComponents.ModalContainer;
const Spinner = window.WarpJS.ReactComponents.Spinner;

const Component = (props) => {
    let content = <Spinner />;

    if (props.documents) {
        debug(`Need show documents.`);
    }

    return (
        <ModalContainer id={NAME} title="Your Documents">
            {content}
        </ModalContainer>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    documents: PropTypes.array
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
