import PropTypes from 'prop-types';

import { NAME } from './constants';

const ModalContainer = window.WarpJS.ReactComponents.ModalContainer;
const Spinner = window.WarpJS.ReactComponents.Spinner;

const Component = (props) => {
    let content = <Spinner />;

    if (props.error) {
        content = <div className="text-danger">{props.errorMessage}</div>;
    }

    return (
        <ModalContainer className="warpjs-user-profile-notifications" id={NAME} title="My Notifications">
            {content}
        </ModalContainer>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    error: PropTypes.bool,
    errorMessage: PropTypes.string
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
