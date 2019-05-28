'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _communityImage = require('./community-image');

var _communityImage2 = _interopRequireDefault(_communityImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import _debug from './debug'; const debug = _debug('community');

var Component = function Component(props) {
    return props.items.map(function (item) {
        var companyInfo = null;
        if (item._embedded && item._embedded.companies) {
            var companies = item._embedded.companies.map(function (company, index) {
                var separator = index ? ', ' : null;
                return _react2.default.createElement(
                    _react2.default.Fragment,
                    { key: company.id },
                    separator,
                    _react2.default.createElement(
                        'a',
                        { href: company._links.self.href },
                        company.label
                    )
                );
            });

            companyInfo = _react2.default.createElement(
                'div',
                { className: 'community-company' },
                companies
            );
        }

        return _react2.default.createElement(
            'div',
            { key: item.id, className: 'community-item' },
            _react2.default.createElement(_communityImage2.default, { image: item._links.image, label: item.label }),
            _react2.default.createElement(
                'div',
                { className: 'community-info' },
                _react2.default.createElement(
                    'div',
                    { className: 'community-item-name' },
                    _react2.default.createElement(
                        'a',
                        { href: item._links.self.href },
                        item.label
                    )
                ),
                companyInfo
            )
        );
    });
};

Component.displayName = 'HtmlExportCommunity';

Component.propTypes = {
    items: _propTypes2.default.array.isRequired
};

exports.default = Component;
