'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('./../../entity-pdf/constants');

var _constants2 = _interopRequireDefault(_constants);

var _community = require('./community');

var _community2 = _interopRequireDefault(_community);

var _paragraph = require('./paragraph');

var _paragraph2 = _interopRequireDefault(_paragraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import _debug from './debug'; const debug = _debug('content');
var Component = function Component(props) {
    var content = function content(items) {
        return items.map(function (item) {
            var subContent = void 0;

            if (item.type === _constants2.default.TYPES.COMMUNITY) {
                subContent = _react2.default.createElement(_community2.default, { items: item._embedded.items });
            } else if (item.type === _constants2.default.TYPES.PARAGRAPH) {
                subContent = _react2.default.createElement(_paragraph2.default, { item: item });
            }

            return _react2.default.createElement(
                'div',
                { key: item.id, id: item.id, className: 'content-section' },
                _react2.default.createElement(
                    'div',
                    { className: 'title' },
                    item.heading || item.name,
                    ' (',
                    _react2.default.createElement(
                        'a',
                        { href: '#' + item.id + '-TOC' },
                        'TOC'
                    ),
                    ')'
                ),
                subContent
            );
        });
    };

    return _react2.default.createElement(
        'div',
        { className: 'content' },
        content(props.items)
    );
};

Component.displayName = 'HtmlExportContent';

Component.propTypes = {
    items: _propTypes2.default.array.isRequired
};

exports.default = Component;
