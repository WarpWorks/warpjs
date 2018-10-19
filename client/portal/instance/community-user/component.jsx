const React = require('react');

const ResponsiveImage = require('./../responsive-image');

const CommunityUser = (props) => {
    const companies = props.user._embedded.companies.map((company, index) => (
        <a key={company.id} href={company._links.self.href} className="warpjs-user-company">{company.label}</a>
    ));

    return (
        <div className="row warpjs-user warpjs-table">
          <div className="warpjs-community-image warpjs-cell">
            <ResponsiveImage src={props.user._links.image.href} />
          </div>

          <div className="warpjs-user-info warpjs-cell">
            <a className="warpjs-user-name" href={props.user._links.self.href}>{props.user.name}</a>
            <div className="warpjs-user-companies">{companies}</div>
          </div>
        </div>
    );
};

module.exports = CommunityUser;
