import { Col } from 'react-bootstrap';

const Component = (props) => (
    <Col xs={12} sm={10}>
        {props.children}
    </Col>
);
Component.displayName = 'PortalContent';

export default Component;
