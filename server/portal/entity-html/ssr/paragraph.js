'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _content = require('./content');

var _content2 = _interopRequireDefault(_content);

var _debug2 = require('./debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('paragraph');

var Component = function Component(props) {
    debug('props=', props);

    var subDocumentContent = null;
    if (props.item._embedded && props.item._embedded.items && props.item._embedded.items.length) {
        subDocumentContent = props.item._embedded.items.map(function (item) {
            debug('subDocumentContent item=', item);

            return _react2.default.createElement(
                'div',
                { key: item.id, className: 'sub-document', id: item.id },
                _react2.default.createElement(
                    'div',
                    { className: 'title' },
                    item.name,
                    ' (',
                    _react2.default.createElement(
                        'a',
                        { href: '#' + item.id + '-TOC' },
                        'TOC'
                    ),
                    ')'
                ),
                _react2.default.createElement(_content2.default, { items: item._embedded.items })
            );
        });
    }

    return _react2.default.createElement(
        'div',
        { className: 'paragraph' },
        _react2.default.createElement('div', { className: 'paragraph-content', dangerouslySetInnerHTML: { __html: props.item.content } }),
        subDocumentContent
    );
};

Component.displayName = 'HtmlExportParagraph';

Component.propTypes = {
    item: _propTypes2.default.shape({
        heading: _propTypes2.default.string,
        content: _propTypes2.default.string,
        _embedded: _propTypes2.default.object
    })
};

exports.default = Component;
