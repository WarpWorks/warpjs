import PropTypes from 'prop-types';
import React from 'react';

import CommunityImage from './community-image';
// import _debug from './debug'; const debug = _debug('community');

const Component = (props) => {
    const items = props.items.map((item) => {
        let companyInfo = null;
        if (item._embedded && item._embedded.companies) {
            const companies = item._embedded.companies.map((company, index) => {
                const separator = index ? `, ` : null;
                return (
                    <React.Fragment key={company.id}>
                        {separator}
                        <a href={company._links.self.href}>{company.label}</a>
                    </React.Fragment>
                );
            });

            companyInfo = <span className="community-company">({companies})</span>;
        }

        return (
            <div key={item.id} className="community-item">
                <div className="community-info">
                    <CommunityImage image={item._links.image} label={item.label} />
                    <span className="community-item-name"><a href={item._links.self.href}>{item.label}</a></span>
                    {' '}
                    {companyInfo}
                </div>
            </div>
        );
    });

    return (
        <ul>{items}</ul>
    );
};

Component.displayName = 'HtmlExportCommunity';

Component.propTypes = {
    items: PropTypes.array.isRequired
};

export default Component;
