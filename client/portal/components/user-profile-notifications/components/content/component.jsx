import { Col, Grid, Row } from 'react-bootstrap';

import DocumentFilters from './../../../document-filters';
import Items from './../items';

// import _debug from './debug'; const debug = _debug('component');

const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const COMPONENT_NAME = 'UserProfileNotificationsContent';

const byDate = (documentA, documentB) => {
    const lastUpdatedA = (new Date(documentA.lastUpdated)).getTime();
    const lastUpdatedB = (new Date(documentB.lastUpdated)).getTime();
    // We want the most recent on top.
    return lastUpdatedB - lastUpdatedA;
};

const byName = (documentA, documentB) => {
    const nameA = documentA.name.toLowerCase();
    const nameB = documentB.name.toLowerCase();

    return nameA.toString().localeCompare(nameB.toString());
};

const Component = (props) => {
    const SubComponent = (someProps) => {
        return <Items showDetails={props.showDetails} {...someProps} />;
    };

    return (
        <Grid fluid>
            <Row>
                <Col xs={12}>
                    <DocumentFilters className="warpjs-user-profile-notifications-content"
                        id={COMPONENT_NAME} RenderComponent={SubComponent} items={props.items}
                        byDate={byDate} byName={byName}
                    />
                </Col>
            </Row>
        </Grid>
    );
};

Component.displayName = COMPONENT_NAME;

Component.propTypes = {
    items: PropTypes.array.isRequired,
    showDetails: PropTypes.func.isRequired
};

export default errorBoundary(Component);
