import { Grid, Row } from 'react-bootstrap';

import CommunityContent from './components/content';
import LeftRightMargin from './../../../../components/left-right-margin';
import PortalContent from './../../../../components/portal-content';

const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <Row className="warpjs-individual-contribution-community">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid>
                    <Row>
                        <CommunityContent users={props.users} />
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
