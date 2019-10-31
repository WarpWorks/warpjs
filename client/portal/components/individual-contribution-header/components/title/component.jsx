import PropTypes from 'prop-types';
import { Col, Grid, Row } from 'react-bootstrap';

import LeftRightMargin from './../../../../components/left-right-margin';
import PortalContent from './../../../../components/portal-content';

const { errorBoundary } = window.WarpJS.ReactUtils;

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

export default errorBoundary(Component);
