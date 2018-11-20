import { Col } from 'react-bootstrap';

const Component = (props) => (
    <Col xs={12} sm={8} smOffset={1} {...props}>
        {props.children}
    </Col>
);
Component.displayName = 'PortalContent';

export default Component;
