import PropTypes from 'prop-types';
import { Col, Glyphicon, Grid, Row } from 'react-bootstrap';

import errorBoundary from './../../../react-utils/error-boundary';
import LeftRightMargin from './../../../react-utils/left-right-margin';
import PortalContent from './../../../react-utils/portal-content';

// import debug from './../../debug';
// const log = debug('client/portal/instance/individual-contribution/component-community');

const convertEntry = (entry) => {
    if (entry.isUser) {
        return <span className="user">{entry.label}</span>;
    } else {
        return <span className="text">{entry.label}</span>;
    }
}

const And = (props) => {
    return <span className="warpjs-individual-contribution-names-and">and</span>;
};

const displayImages = (displayedUsers) => {
    return (
        <div className="warpjs-individual-contribution-images">
        </div>
    );
};

const displayNames = (displayedUsers, moreUsers) => {
    // FIXME: Better logic than this hard-coded.
    const names = [];

    names.push(<span className="warpjs-individual-contribution-names-item">{displayedUsers[0].label}</span>);

    if (displayedUsers.length >= 2) {
        names.push(
            <React.Fragment>
                {
                    displayedUsers.length === 2
                        ? <React.Fragment> <And/ > </React.Fragment>
                        : <React.Fragment>, </React.Fragment>
                }
                <span className="warpjs-individual-contribution-names-item">{displayedUsers[1].label}</span>
            </React.Fragment>
        );
    }

    if (displayedUsers.length >= 3) {
        names.push(
            <React.Fragment>
                {displayedUsers.length === 3 ? ', and' : ','} <span className="warpjs-individual-contribution-names-item">{displayedUsers[2].label}</span>
            </React.Fragment>
        );
    }

    if (displayedUsers.length === 4) {
        names.push(
            <React.Fragment>
                {moreUsers ? ',' : ', and'} <span className="warpjs-individual-contribution-names-item">{displayedUsers[3].label}</span>
            </React.Fragment>
        );
    }

    if (moreUsers) {
        names.push(
            <React.Fragment> <And /> <span className="warpjs-individual-contribution-names-more">{moreUsers} more</span></React.Fragment>
        );
    }

    names.push(
        <a className="warpjs-individual-contribution-see-all pull-right" href="#community">see all</a>
    );

    return names;
};

const content = (users) => {
    const displayedUsers = users.slice(0, 4);
    const moreUsers = users.length - displayedUsers.length;

    if (displayedUsers.length) {
        return (
            <div className="warpjs-individual-contribution-names">
                {displayNames(displayedUsers, moreUsers)}
            </div>
        );
    } else {
        return (
            <Col xs={12} className="warpjs-individual-contribution-no-community">
                No authors or contributors defined
            </Col>
        );
    }
};


const Component = (props) => {
    return (
        <Row className="warpjs-individual-contribution-community">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid>
                    <Row>
                        {content(props.users)}
                    </Row>
                </Grid>
            </PortalContent>

            <LeftRightMargin />
        </Row>
    );
};

Component.displayName = 'IndividualContributionCommunity';

Component.propTypes = {
    users: PropTypes.array.isRequired
};

export default errorBoundary(Component);
