import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

import Items from './../items';

const Component = (props) => {
    // TODO: Add sorting and filters.
    return (
        <Fragment>
            <Grid fluid>
                <Row>
                    <Col xs={12}>
                        Coming soon... sort and filter.
                    </Col>
                </Row>
            </Grid>
            <Items items={props.items} showDetails={props.showDetails} />
        </Fragment>
    );
};

Component.displayName = 'UserProfileNotificationsContent';

Component.propTypes = {
    items: PropTypes.array.isRequired,
    showDetails: PropTypes.func.isRequired
};


export default window.WarpJS.ReactUtils.errorBoundary(Component);
