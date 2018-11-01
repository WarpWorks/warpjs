import { Col } from 'react-bootstrap';

import errorBoundary from './error-boundary';

const Component = (props) => {
    return (
        <Col sm={1} xsHidden className="left-right-margin" />
    );
};
Component.displayName = 'LeftRightMargin';

export default errorBoundary(Component);
