import { Col, Grid, Row } from 'react-bootstrap';

import AssociationModalContent from './components/content';
import AssociationModalList from './components/list';
import errorBoundary from './../../../react-utils/error-boundary';

const Component = (props) => {
    return (
        <Grid fluid className="warpjs-association-modal">
            <Row>
                <Col xs={4} className="warpjs-association-modal-list">
                    <AssociationModalList />
                </Col>
                <Col xs={8} className="warpjs-association-modal-content">
                    <AssociationModalContent />
                </Col>
            </Row>
        </Grid>
    );
};
Component.displayName = 'AssociationModal';

export default errorBoundary(Component);
