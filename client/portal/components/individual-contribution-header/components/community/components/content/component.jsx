import PropTypes from 'prop-types';
import React from 'react';
import { Col } from 'react-bootstrap';

import And from './../and';
import AndMore from './../and-more';
import ResponsiveImage from './../../../responsive-image';
import SeeAll from './../see-all';
import UserName from './../user-name';

const displayImages = (displayedUsers) => displayedUsers.map((user) => <ResponsiveImage key={user.id} src={user._links.image.href} />);

const displayNames = (displayedUsers, moreUsers) => {
    // FIXME: Better logic than this hard-coded.
    const names = [];

    names.push(<UserName key={displayedUsers[0].id} user={displayedUsers[0]} />);

    if (displayedUsers.length >= 2) {
        names.push(
            <React.Fragment key={displayedUsers[1].id}>
                {
                    displayedUsers.length === 2
                        ? <React.Fragment> <And/ > </React.Fragment>
                        : <React.Fragment>, </React.Fragment>
                }
                <UserName user={displayedUsers[1]} />
            </React.Fragment>
        );
    }

    if (displayedUsers.length >= 3) {
        names.push(
            <React.Fragment key={displayedUsers[2].id}>
                {displayedUsers.length === 3 ? ', and' : ','} <UserName user={displayedUsers[2]} />
            </React.Fragment>
        );
    }

    if (displayedUsers.length === 4) {
        names.push(
            <React.Fragment key={displayedUsers[3].id}>
                {moreUsers ? ',' : ', and'} <UserName user={displayedUsers[3]} />
            </React.Fragment>
        );
    }

    if (moreUsers) {
        names.push(<AndMore key="more-users" moreUsers={moreUsers} />);
    }

    names.push(<SeeAll key="see-all" />);

    return names;
};

const Component = (props) => {
    const displayedUsers = props.users.slice(0, 4);
    const moreUsers = props.users.length - displayedUsers.length;

    if (displayedUsers.length) {
        const displayedImages = displayImages(displayedUsers);
        const displayedNames = displayNames(displayedUsers, moreUsers);

        return (
            <React.Fragment>
                <Col xs={12} xsHidden className="warpjs-individual-contribution-container">
                    <div className={`warpjs-individual-contribution-images warpjs-individual-contribution-images-${displayedUsers.length}`}>
                        {displayedImages}
                    </div>
                    <div className="warpjs-individual-contribution-names">
                        {displayedNames}
                    </div>
                </Col>

                <Col xs={12} smHidden mdHidden lgHidden className="warpjs-individual-contribution-container-xs">
                    <div className="warpjs-individual-contribution-images">
                        {displayedImages}
                    </div>
                    <div className="warpjs-individual-contribution-names">
                        {displayedNames}
                    </div>
                </Col>
            </React.Fragment>
        );
    } else {
        return (
            <Col xs={12} className="warpjs-individual-contribution-no-community">
                No authors or contributors defined
            </Col>
        );
    }

};

Component.displayName = 'IndividualContributionHeaderCommunityContent';

Component.propTypes = {
    users: PropTypes.array.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
