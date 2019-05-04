import moment from 'moment';
import PropTypes from 'prop-types';
import { Col, Grid, Panel, Row } from 'react-bootstrap';

import Diff from './../diff';


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
                                <Row>
                                    <Col xs={3} className="warpjs-display-image">
                                        <img src={user.image} />
                                    </Col>
                                    <Col xs={9} className="warpjs-content">
                                        <div className="warpjs-show-details pull-right"
                                            onClick={() => props.showDetails(props.item.type, props.item.id)}
                                            >show details</div>
                                        <div>By <span className="warpjs-user">{user.name}</span> - <span className="warpjs-timestamp">{moment(timestamp).fromNow()}</span></div>
                                        <Diff data={changeLog.data} />
                                    </Col>
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

export default window.WarpJS.ReactUtils.errorBoundary(Component);
