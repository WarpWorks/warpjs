import PropTypes from 'prop-types';
import { Button, Row } from 'react-bootstrap';

import LeftRightMargin from './../left-right-margin';
import PortalContent from './../portal-content';
import UserProfileDocuments from './../user-profile-documents';

// import _debug from './debug'; const debug = _debug('component');

const Component = (props) => {
    if (props.myPage) {
        return (
            <Row className="warpjs-user-profile-menu">
                <LeftRightMargin />

                <PortalContent>
                    {/* <Button bsStyle="primary">Notifications</Button> */}

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
    showDocuments: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
