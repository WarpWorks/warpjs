const { PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <div className="warpjs-image-container-parent">
            <div className="warpjs-image-container-child">
                <img src={props.src} />
            </div>
        </div>
    );
};

Component.displayName = 'ResponsiveImage';

Component.propTypes = {
    src: PropTypes.string.isRequired
};

export default Component;
