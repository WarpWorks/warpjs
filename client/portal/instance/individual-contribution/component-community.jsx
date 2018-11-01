import PropTypes from 'prop-types';
import { Col, Glyphicon, Grid, Row } from 'react-bootstrap';

import errorBoundary from './../../../react-utils/error-boundary';
import LeftRightMargin from './../../../react-utils/left-right-margin';
import PortalContent from './../../../react-utils/portal-content';

const convertEntry = (entry) => {
    if (entry.isUser) {
        return <span className="user">{entry.label}</span>;
    } else {
        return <span className="text">{entry.label}</span>;
    }
}


const Component = (props) => {
    const displayedUsers = props.users.slice(0, 4);
    const moreUsers = props.users.length - displayedUsers.length;

    const entries = displayedUsers.map((user) => ({
        label: user.label,
        isUser: true
    }));
    if (moreUsers) {
        entries.push({
            label: `${moreUsers} more`,
        });
    }

    const namesString = entries.map((name, index, list) => {
        if (index === list.length - 1) {
            // Last element.
            if (index === 1) {
                // Only 2 elements.
                return (
                    <span>
                        and
                        {convertEntry(name)}
                    </span>
                );
            } else {
                return (
                    <span>
                        , and
                        {name.isUser ? <span className="user">{name.label}</span> : name.label}
                    </span>
                );
            }
        } else if (index) {
            // Not the first one.
            return (
                <span>
                    ,
                    {name.isUser ? <span className="user">{name.label}</span> : name.label}
                </span>
            )
        } else {
        }
    });

    let namesString;
    if (names.length) {
        if (names.length > 2) {
            if (!moreUsers) {
                names[names.length - 1] = `and ${names[names.length - 1]}`;
            }
            namesString = names.join(', ');
        } else {
            namesString = names.join(' and ');
        }
    }

    const moreString = moreUsers ? `and ${moreUsers} more` : '';

    return (
        <Row className="warpjs-individual-contribution-community">
            <LeftRightMargin />

            <PortalContent>
                <Grid fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="warpjs-individual-contribution-images">
                            </div>
                            <div className="warpjs-individual-contribution-names">
                              <span className="warpjs-individual-contribution-list">
                                  {namesString}
                              </span>
                              <span className="warpjs-individual-contribution-see-all">
                                <a href="#community">see all</a>
                              </span>
                            </div>
                        </Col>
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
