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

var _tableOfContents = require('./table-of-contents');

var _tableOfContents2 = _interopRequireDefault(_tableOfContents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STYLE = '\n    .table-of-contents {\n      margin-left: 50px;\n    }\n\n    .sub-document {\n      margin-left: 10px;\n      padding-left: 10px;\n      border-left: thin solid;\n    }\n\n    .title {\n      font-weight: bold;\n      margin-top: 30px;\n      margin-bottom: 10px;\n    }\n\n    .content-section {\n      padding-left: 10px;\n    }\n\n    .community-item {\n      width: 33%;\n      float: left;\n      padding-bottom: 10px;\n    }\n\n    .community-item .community-image {\n      max-width: 50px;\n      max-height: 50px;\n      border-radius: 50%;\n      float: left;\n    }\n\n    .community-item .community-info {\n      padding-top: 30px;\n      padding-left: 120px;\n    }\n';

var Component = function Component(props) {
  return _react2.default.createElement(
    'html',
    null,
    _react2.default.createElement(
      'head',
      null,
      _react2.default.createElement(
        'title',
        null,
        props.type,
        ' / ',
        props.name
      ),
      _react2.default.createElement('link', { rel: 'shortcut icon', href: '/public/favicon.ico' }),
      _react2.default.createElement('link', { rel: 'icon', href: '/public/favicon.ico' }),
      _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: STYLE } })
    ),
    _react2.default.createElement(
      'body',
      null,
      _react2.default.createElement(
        'h1',
        null,
        props.name
      ),
      _react2.default.createElement(_tableOfContents2.default, { items: props._embedded.items }),
      _react2.default.createElement(_content2.default, { items: props._embedded.items })
    )
  );
};

Component.displayName = 'HtmlExportMain';

Component.propTypes = {
  name: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.string.isRequired,
  _embedded: _propTypes2.default.object
};

exports.default = Component;
