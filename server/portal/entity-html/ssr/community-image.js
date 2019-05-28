'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import _debug from './debug'; const debug = _debug('community-image');

var Component = function Component(props) {
    return _react2.default.createElement('img', { className: 'community-image', src: props.image.href, alt: props.image.title || props.label });
};

Component.displayName = 'HtmlExportCommunityImage';

Component.propTypes = {
    image: _propTypes2.default.shape({
        href: _propTypes2.default.string.isRequired,
        title: _propTypes2.default.string
    }),
    label: _propTypes2.default.string.isRequired
};

exports.default = Component;
