const ResponsiveImage = require('./../responsive-image');

const CommunityUser = (props) => {
    const { user } = props;

    const companies = user._embedded && user._embedded.companies
        ? user._embedded.companies.map((company, index) => (
            <a key={company.id} href={company._links.self.href} className="warpjs-user-company">{company.label}</a>
        ))
        : null
    ;

    return (
        <ReactBootstrap.Row className="warpjs-user warpjs-table">
          <div className="warpjs-community-image warpjs-cell">
            <ResponsiveImage src={user._links.image.href} />
          </div>

          <div className="warpjs-user-info warpjs-cell">
            <a className="warpjs-user-name" href={user._links.self.href}>{user.name}</a>
            <div className="warpjs-user-companies">{companies}</div>
          </div>
        </ReactBootstrap.Row>
    );
};

module.exports = CommunityUser;
