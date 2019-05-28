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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import _debug from './debug'; const debug = _debug('table-of-contents');

var Component = function Component(props) {
    var content = function content(items) {
        return items.map(function (item) {
            // debug(`document level item=`, item);

            var subContent = void 0;
            if (item.type === _constants2.default.TYPES.COMMUNITY) {
                // debug(`community item`);
                subContent = null;
            } else if (item.type === _constants2.default.TYPES.PARAGRAPH) {
                // debug(`paragraph item`);
                if (item._embedded && item._embedded.items && item._embedded.items.length) {
                    // debug(`paragraph has aggregation. Need add to TOC:`, item._embedded.items);
                    var subTOC = item._embedded.items.map(function (subDocument) {
                        // debug(`[subTOC]: subDocument=`, subDocument);

                        var subDocumentTOC = null;
                        if (subDocument && subDocument._embedded && subDocument._embedded.items && subDocument._embedded.items.length) {
                            // debug(`[subTOC]:     contains items`);
                            subDocumentTOC = _react2.default.createElement(
                                'ul',
                                null,
                                content(subDocument._embedded.items)
                            );
                        }

                        return _react2.default.createElement(
                            'li',
                            { key: subDocument.id },
                            _react2.default.createElement(
                                'a',
                                { href: '#' + subDocument.id, id: subDocument.id + '-TOC' },
                                subDocument.name
                            ),
                            subDocumentTOC
                        );
                    });
                    subContent = _react2.default.createElement(
                        'ul',
                        null,
                        subTOC
                    );
                }
            }

            return _react2.default.createElement(
                'li',
                { key: item.id },
                _react2.default.createElement(
                    'a',
                    { href: '#' + item.id, id: item.id + '-TOC' },
                    item.heading || item.name
                ),
                subContent
            );
        });
    };

    return _react2.default.createElement(
        'div',
        { className: 'table-of-content' },
        _react2.default.createElement(
            'div',
            { className: 'title' },
            'Table of contents'
        ),
        _react2.default.createElement(
            'ul',
            { className: 'table-of-content' },
            content(props.items)
        )
    );
};

Component.displayName = 'HtmlExportTableOfContents';

Component.propTypes = {
    items: _propTypes2.default.array.isRequired
};

exports.default = Component;
