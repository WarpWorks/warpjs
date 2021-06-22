'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

const Component = function Component(props) {
    return _react2.default.createElement(
        'html',
        null,
        _react2.default.createElement(
            'head',
            null,
            _react2.default.createElement(
                'title',
                null,
                props.name
            ),
            _react2.default.createElement('link', { rel: 'shortcut icon', href: '/public/favicon.ico' }),
            _react2.default.createElement('link', { rel: 'icon', href: '/public/favicon.ico' })
        ),
        _react2.default.createElement(
            'body',
            null,
            _react2.default.createElement(
                'h1',
                null,
                props.label
            ),
            _react2.default.createElement(
                'p',
                null,
                props.error
            )
        )
    );
};

Component.displayName = 'test';

exports.default = Component;
