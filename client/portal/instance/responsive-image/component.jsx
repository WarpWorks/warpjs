import PropTypes from 'prop-types';

const ResponsiveImage = (props) => {
    return (
        <div className="warpjs-image-container-parent">
            <div className="warpjs-image-container-child">
                <img src={props.src} />
            </div>
        </div>
    );
};

ResponsiveImage.displayName = 'ResponsiveImage';

ResponsiveImage.propTypes = {
    src: PropTypes.string.isRequired
};

module.exports = ResponsiveImage;
