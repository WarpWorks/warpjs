const React = require('react');

const ResponsiveImage = (props) => {
    return (
        <div className="warpjs-image-container-parent">
            <div className="warpjs-image-container-child">
                <img src={props.src} />
            </div>
        </div>
    );
};

module.exports = ResponsiveImage;
