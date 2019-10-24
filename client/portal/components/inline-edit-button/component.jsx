import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

import AggregationEditor from './../aggregation-editor';

import { NAME } from './constants';

const { Fragment, PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const tooltip = <Tooltip>Edit aggregation {'"'}{props.title}{'"'}</Tooltip>;

    return (
        <Fragment>
            <OverlayTrigger placement="top" overlay={tooltip}>
                <span className="warpjs-inline-edit-context" onClick={() => props.showModal()}>
                    <Glyphicon glyph="pencil" />
                </span>
            </OverlayTrigger>
            <AggregationEditor id={props.id} title={props.title} />
        </Fragment>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    id: PropTypes.string.isRequired,
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default errorBoundary(Component);
