import { ELEMENTS, NAME } from './../constants';

const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.visibleTiles.size) {
        return null;
    } else {
        return (
            <div className={ELEMENTS.EMPTY_RESULTS}>
                <div className="warpjs-title">No search results</div>
                <div className="warpjs-content">Please change your search</div>
            </div>
        );
    }
};

Component.displayName = `${NAME}EmptyResults`;

Component.propTypes = {
    visibleTiles: PropTypes.instanceOf(Set).isRequired
};

export default errorBoundary(Component);
