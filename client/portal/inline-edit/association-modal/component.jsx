import { Col, Grid, Row } from 'react-bootstrap';

import AssociationModalContent from './components/content';
import AssociationModalList from './components/list';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <Grid fluid className="warpjs-association-modal">
            <Row>
                <Col xs={6} className="warpjs-association-modal-list-container">
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

export default errorBoundary(Component);
