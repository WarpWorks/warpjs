import { Col, Grid, Row } from 'react-bootstrap';

import AssociationModalContent from './components/content';
import AssociationModalList from './components/list';

const Component = (props) => {
    return (
        <Grid fluid className="warpjs-association-modal">
            <Row>
                <Col xs={6} className="warpjs-association-modal-list">
                    <AssociationModalList {...props} />
                </Col>
                <Col xs={6} className="warpjs-association-modal-content">
                    <AssociationModalContent {...props} />
                </Col>
            </Row>
        </Grid>
    );
};
Component.displayName = 'AssociationModal';

export default window.WarpJS.ReactUtils.errorBoundary(Component);
