import { Col } from 'react-bootstrap';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <Col sm={1} xsHidden className="left-right-margin" />
    );
};

Component.displayName = 'LeftRightMargin';

export default errorBoundary(Component);
