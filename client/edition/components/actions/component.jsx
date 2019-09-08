import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <span>Foo bar</span>
    );
};

Component.displayName = NAME;

export default errorBoundary(Component);
