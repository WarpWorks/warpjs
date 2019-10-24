import { Button, Row } from 'react-bootstrap';

import LeftRightMargin from './../left-right-margin';
import PortalContent from './../portal-content';
import UserProfileDocuments from './../user-profile-documents';
import UserProfileNotifications from './../user-profile-notifications';

// import _debug from './debug'; const debug = _debug('component');

const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.myPage) {
        return (
            <Row className="warpjs-user-profile-menu">
                <LeftRightMargin />

                <PortalContent>
                    <Button bsStyle="primary" onClick={props.showNotifications}>Notifications</Button>
                    <UserProfileNotifications />

                    <Button bsStyle="primary" onClick={props.showDocuments}>My Documents</Button>
                    <UserProfileDocuments />
                </PortalContent>

                <LeftRightMargin />
            </Row>
        );
    } else {
        return null;
    }
};

Component.displayName = 'UserProfileMenu';

Component.propTypes = {
    myPage: PropTypes.bool,
    showDocuments: PropTypes.func.isRequired,
    showNotifications: PropTypes.func.isRequired
};

export default errorBoundary(Component);
