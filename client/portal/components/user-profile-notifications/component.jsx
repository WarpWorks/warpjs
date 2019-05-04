import PropTypes from 'prop-types';

import { NAME } from './constants';
import Content from './components/content';

const ModalContainer = window.WarpJS.ReactComponents.ModalContainer;
const Spinner = window.WarpJS.ReactComponents.Spinner;

const Component = (props) => {
    let content = <Spinner />;

    if (props.error) {
        content = <div className="text-danger">{props.errorMessage}</div>;
    } else if (props.showDetailsFor) {
        content = <Details items={props.notifications} hideDetails={props.hideDetails} detailsFor={props.showDetailsFor} />;
    } else if (props.notifications) {
        content = <Content items={props.notifications} showDetails={props.showDetails} />;
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
    errorMessage: PropTypes.string,
    notifications: PropTypes.array.isRequired,
    showDetails: PropTypes.func.isRequired,
    showDetailsFor: PropTypes.object,
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
