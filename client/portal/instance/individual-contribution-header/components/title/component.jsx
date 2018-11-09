import PropTypes from 'prop-types';
import { Col, Grid, Row } from 'react-bootstrap';

import LeftRightMargin from './../../../../../react-utils/left-right-margin';
import PortalContent from './../../../../../react-utils/portal-content';

const Component = (props) => {
    return (
        <Row className="warpjs-individual-contribution-title-row">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid className="warpjs-individual-contribution-title-container">
                    <Row>
                        <Col xs={12} className="warpjs-individual-contribution-title">
                            {props.name}
                        </Col>
                    </Row>
                </Grid>
            </PortalContent>

            <LeftRightMargin />
        </Row>
    );
};

Component.displayName = 'IndividualContributionTitle';

Component.propTypes = {
    name: PropTypes.string.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
