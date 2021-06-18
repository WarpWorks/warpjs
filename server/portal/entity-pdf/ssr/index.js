'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

const _server = require('react-dom/server');

const _main = require('./main');

const _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function(errorData) {
    return (0, _server.renderToString)(_react2.default.createElement(_main2.default, errorData));
};
