import moment from 'moment';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Col } from 'react-bootstrap';

import Diff from './../diff';
import _debug from './debug'; const debug = _debug('component');

const Component = (props) => {
    debug(`props=`, props);
    return (
        <Fragment>
            <Col xs={3} className="warpjs-display-image">
                <img src={props.user.image} />
            </Col>
            <Col xs={9} className="warpjs-content">
                <div>By <span className="warpjs-user">{props.user.name}</span> - <span className="warpjs-timestamp">{moment(props.timestamp).fromNow()}</span></div>
                <div className="warpjs-change-log-key">
                    <span className="wapjs-label">{props.changeLog.actionLabel}</span>{' '}
                    [ <span className="warpjs-value" title={props.changeLog.helpText}>{props.changeLog.key}</span> ]
                </div>
                <Diff changeLog={props.changeLog} />
            </Col>
        </Fragment>
    );
};

Component.displayName = 'UserProfileNotificationsDetailItem';

Component.propTypes = {
    changeLog: PropTypes.object.isRequired,
    timestamp: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
