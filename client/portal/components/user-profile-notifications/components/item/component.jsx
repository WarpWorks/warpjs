import { Col, Glyphicon, Grid, Panel, Row } from 'react-bootstrap';

import DetailItem from './../detail-item';

const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const changeLog = props.item.changeLogs[0];
    const timestamp = (new Date(props.item.lastUpdated)).getTime();

    const user = changeLog.user;

    return (
        <Grid fluid className="warpjs-user-profile-notifications-item">
            <Row>
                <Col xs={12} className="warpjs-title">
                    <a href={props.item._links.self.href}>{props.item.name}</a>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Panel className="warpjs-change-log">
                        <Panel.Body>
                            <Grid fluid>
                                <Row className="warpjs-body">
                                    <DetailItem user={user} timestamp={timestamp} changeLog={changeLog} />
                                    <div className="warpjs-show-details" onClick={() => props.showDetails(props.item.type, props.item.id)}>
                                        show details
                                        {' '}
                                        <Glyphicon glyph="arrow-right" />
                                    </div>
                                </Row>
                            </Grid>
                        </Panel.Body>
                    </Panel>
                </Col>
            </Row>
        </Grid>
    );
};

Component.displayName = 'UserProfileNotificationsItem';

Component.propTypes = {
    item: PropTypes.object.isRequired,
    showDetails: PropTypes.func.isRequired
};

export default errorBoundary(Component);
