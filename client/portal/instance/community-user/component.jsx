import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';

import ResponsiveImage from './../responsive-image';

const Component = (props) => {
    const { user } = props;

    const companies = user._embedded && user._embedded.companies
        ? user._embedded.companies.map((company, index) => (
            <a key={company.id} href={company._links.self.href} className="warpjs-user-company">{company.label}</a>
        ))
        : null
    ;

    return (
        <Row className="warpjs-user warpjs-table">
            <div className="warpjs-community-image warpjs-cell">
                <ResponsiveImage src={user._links.image.href} />
            </div>

            <div className="warpjs-user-info warpjs-cell">
                <a className="warpjs-user-name" href={user._links.self.href}>{user.name}</a>
                <div className="warpjs-user-companies">{companies}</div>
            </div>
        </Row>
    );
};

Component.displayName = 'CommunityUser';

Component.propTypes = {
    user: PropTypes.object.isRequired
};

module.exports = Component;
