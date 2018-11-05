import PropTypes from 'prop-types';
import { Col, Glyphicon, Grid, Row } from 'react-bootstrap';

import CommunityContent from './components/content';
import errorBoundary from './../../../../../react-utils/error-boundary';
import LeftRightMargin from './../../../../../react-utils/left-right-margin';
import PortalContent from './../../../../../react-utils/portal-content';

// import debug from './../../debug';
// const log = debug('client/portal/instance/individual-contribution/component-community');

const Component = (props) => {
    return (
        <Row className="warpjs-individual-contribution-community">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid>
                    <Row>
                        <Col xs={12}>
                            <CommunityContent users={props.users} />
                        </Col>
                    </Row>
                </Grid>
            </PortalContent>

            <LeftRightMargin />
        </Row>
    );
};

Component.displayName = 'IndividualContributionCommunity';

Component.propTypes = {
    users: PropTypes.array.isRequired
};

export default errorBoundary(Component);
