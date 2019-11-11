import { ELEMENTS, NAME } from './../constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <div className={ELEMENTS.EMPTY_RESULTS}>
            <div className="warpjs-title">No search results</div>
            <div className="warpjs-content">Please change your search</div>
        </div>
    );
};

Component.displayName = `${NAME}EmptyResults`;

Component.propTypes = {
};

export default errorBoundary(Component);
