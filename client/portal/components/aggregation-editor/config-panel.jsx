import PropTypes from 'prop-types';
import { Alert, Checkbox, Col, ControlLabel, Form, FormControl, FormGroup, Grid, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import oxfordComma from './../../../../lib/utils/oxford-comma';

const { ActionIcon, Button } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const filterGroupItems = (props.filters || []).map((filter) => {
        const association = props.associations.find((association) => association.id === filter.id);
        if (!association) {
            return null;
        }

        const name = association.label || association.name;
        const relationships = oxfordComma(association.relationships.map((reln) => reln.label || reln.name));

        return (
            <ListGroupItem key={association.id}>
                <span className="pull-right">
                    <ActionIcon glyph="trash" title="Remove filter" style="danger" onClick={association.removeFilter} />
                </span>
                <div>{name} ({relationships})</div>
                <Form horizontal>
                    <FormGroup controlId={`filter-label-${association.id}`}>
                        <Col componentClass={ControlLabel} xs={5}>Filter label:</Col>
                        <Col xs={7}>
                            <FormControl type="text" placeholder="Filter name to display"
                                value={filter.editLabel !== undefined ? filter.editLabel : filter.label}
                                onChange={(event) => association.updateFilterLabel(event.target.value)}
                                onBlur={() => association.saveFilterLabel(filter.editLabel, filter.label)}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId={`filter-use-parent-${association.id}`}>
                        <Col componentClass={ControlLabel} xs={5}>Use parent:</Col>
                        <Col xs={7}><Checkbox checked={filter.useParent} onChange={(event) => association.toggleUseParent(event.target.checked)} /></Col>
                    </FormGroup>
                </Form>
            </ListGroupItem>
        );
    }).filter((filter) => filter); // Filter out null.

    const filterItems = filterGroupItems && filterGroupItems.length
        ? <ListGroup>{filterGroupItems}</ListGroup>
        : <Alert bsStyle="warning">None defined. Add from list.</Alert>
    ;

    const associationGroupItems = (props.associations || []).map((association) => {
        const alreadyFiltered = (props.filters || []).find((filter) => filter.id === association.id);
        if (alreadyFiltered) {
            return null;
        }

        const name = association.label || association.name;
        const relationships = oxfordComma(association.relationships.map((reln) => reln.label || reln.name));

        return (
            <ListGroupItem key={association.id}>
                <span className="pull-right">
                    <Button size="xs" label="Add" style="primary" onClick={association.addFilter} />
                </span>
                <span>
                    {name} ({relationships})
                </span>
            </ListGroupItem>
        );
    }).filter((item) => item); // Filter out null.

    const associationItems = associationGroupItems && associationGroupItems.length
        ? <ListGroup>{associationGroupItems}</ListGroup>
        : <Alert bsStyle="warning">No filters available.</Alert>
    ;

    return (
        <Grid fluid>
            <Row>
                <Col xs={6}>{filterItems}</Col>
                <Col xs={6}>{associationItems}</Col>
            </Row>
        </Grid>
    );
};

Component.propTypes = {
    associations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        relationships: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        }))
    })),
    filters: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired
    }))
};

export default errorBoundary(Component);
