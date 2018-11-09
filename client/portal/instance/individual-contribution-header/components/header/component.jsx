import PropTypes from 'prop-types';
import { Col, Grid, Row } from 'react-bootstrap';

import LeftRightMargin from './../../../../../react-utils/left-right-margin';
import PortalContent from './../../../../../react-utils/portal-content';

const Component = (props) => {
    return (
        <Row className="warpjs-individual-contribution-top">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid>
                    <Row>
                        {/*
                        <Col xs={12} sm={6} className="warpjs-individual-contribution-disclaimer pull-right text-right">
                            <Glyphicon glyph="exclamation-sign" />
                            &nbsp;
                            Please read the Legal disclaimer
                        </Col>
                        */}

                        <Col xs={12} sm={6} className="warpjs-individual-contribution-label">
                            Individual Contribution
                        </Col>
                    </Row>
                </Grid>
            </PortalContent>

            <LeftRightMargin />
        </Row>
    );
};

Component.displayName = 'IndividualContributionTop';

Component.propTypes = {
    customMessages: PropTypes.object.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
