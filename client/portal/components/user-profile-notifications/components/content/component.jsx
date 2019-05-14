import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

import DocumentFilters from './../../../document-filters';
import Items from './../items';

const Component = (props) => {
    return (
        <Fragment>
            <Grid fluid>
                <Row>
                    <Col xs={12}>
                        Coming soon... sort and filter.
                        <DocumentFilters filters={props.filters} updateFilter={props.updateFilter} />
                    </Col>
                </Row>
            </Grid>
            <Items items={props.items} showDetails={props.showDetails} />
        </Fragment>
    );
};

Component.displayName = 'UserProfileNotificationsContent';

Component.propTypes = {
    filters: PropTypes.object,
    items: PropTypes.array.isRequired,
    showDetails: PropTypes.func.isRequired,
    updateFilter: PropTypes.func.isRequired,
};


export default window.WarpJS.ReactUtils.errorBoundary(Component);
