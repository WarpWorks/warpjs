import PropTypes from 'prop-types';
import { Col, Glyphicon, Grid, Row } from 'react-bootstrap';

import errorBoundary from './../../../react-utils/error-boundary';
import LeftRightMargin from './../../../react-utils/left-right-margin';
import PortalContent from './../../../react-utils/portal-content';

const Component = (props) => {
    return (
        <Row className="warpjs-individual-contribution-title-row">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid className="warpjs-individual-contribution-title">
                    <Row>
                        <Col xs={12}>
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
