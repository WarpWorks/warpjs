import PropTypes from 'prop-types';
import { Col, Grid, Row } from 'react-bootstrap';

import AssociationModalListItems from './../list-items';
import * as shapes from './../../../../../react-utils/shapes';

const Component = (props) => {
    return (
        <Grid fluid className="warpjs-association-modal-list">
            <Row>
                <Col xs={12} className="warpjs-association-modal-title-container">
                    <div className="warpjs-label">
                        Document Name
                    </div>
                    <div className="warpjs-value">
                        {props.name}
                    </div>
                </Col>
                <Col xs={12} className="warpjs-association-modal-name-container">
                    <div className="warpjs-label">
                        Association Name
                    </div>
                    <div className="warpjs-value">
                        {props.relationship.label}
                    </div>
                </Col>
                <Col xs={12} className="warpjs-association-modal-items-container">
                    <div className="warpjs-label">
                        Associations
                    </div>
                    <div className="warpjs-value">
                        <AssociationModalListItems {...props} items={props.relationship.items} />
                    </div>
                </Col>
            </Row>
        </Grid>
    );
};

Component.displayName = 'AssociationModalList';

Component.propTypes = {
    name: PropTypes.string,
    relationship: shapes.relationship
};
export default Component;
