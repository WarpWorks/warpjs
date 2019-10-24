import { Col, Glyphicon, Grid, Row } from 'react-bootstrap';

import DetailItem from './../detail-item';

// import _debug from './debug'; const debug = _debug('component');

const { errorBoundary, Fragment, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const item = props.items.find((item) => item.type === props.detailsFor.type && item.id === props.detailsFor.id);

    const changeLogs = item.changeLogs.map((changeLog, index) => {
        const timestamp = (new Date(changeLog.timestamp)).getTime();
        const separator = index
            ? <Col xs={12}><hr /></Col>
            : null
        ;

        return (
            <Row key={index.toString()}>
                {separator}
                <DetailItem user={changeLog.user} timestamp={timestamp} changeLog={changeLog} />
            </Row>
        );
    });

    return (
        <Fragment>
            <Grid fluid>
                <Row>
                    <Col xs={12} className="warpjs-back">
                        <span className="warpjs-link" onClick={() => props.hideDetails()}>
                            <Glyphicon glyph="arrow-left" />
                            {' '}
                            Back
                        </span>
                        <span className="warpjs-title" title={item.name}>{item.name}</span>
                    </Col>
                </Row>
            </Grid>

            <Grid fluid className="warpjs-content">
                {changeLogs}
            </Grid>
        </Fragment>
    );
};

Component.displayName = 'UserProfileNotificationsDetails';

Component.propTypes = {
    detailsFor: PropTypes.object.isRequired,
    hideDetails: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired
};

export default errorBoundary(Component);
