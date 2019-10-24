import { Col } from 'react-bootstrap';

const { PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => (
    <Col xs={12} sm={8} smOffset={1} {...props}>
        {props.children}
    </Col>
);
Component.displayName = 'PortalContent';

Component.propTypes = {
    children: PropTypes.node.isRequired
};

export default Component;
