import { Col } from 'react-bootstrap';

const Component = (props) => {
    return (
        <Col sm={1} xsHidden className="left-right-margin" />
    );
};
Component.displayName = 'LeftRightMargin';

export default window.WarpJS.ReactUtils.errorBoundary(Component);
