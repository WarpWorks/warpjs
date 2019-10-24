const { errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const oxfordComma = (relationships) => {
    switch (relationships.length) {
        case 1: {
            return relationships[0];
        }

        case 2: {
            return `${relationships[0]} and ${relationships[1]}`;
        }

        default: {
            return `${relationships[0]}, ${relationships[1]}, and ${relationships[2]}`;
        }
    }
};

const Component = (props) => {
    const lastUpdated = (new Date(props.item.lastUpdated)).toString();

    const relnTypes = [];
    if (props.item.relnType.author) {
        relnTypes.push('author');
    }
    if (props.item.relnType.contributor) {
        relnTypes.push('contributor');
    }
    if (props.item.relnType.follow) {
        relnTypes.push('follower');
    }

    const unfollowLink = props.item.relnType.follow
        ? <div className="unfollow-link"><a href={props.item._links.unfollow.href}>unfollow this document</a></div>
        : null;

    return (
        <div className="warpjs-user-profile-documents-item">
            <div className="name"><a href={props.item._links.self.href}>{props.item.name}</a></div>
            <div className="relationship">You are {oxfordComma(relnTypes)} of this document</div>
            <div className="last-updated">Last updated: {lastUpdated}</div>
            {unfollowLink}
        </div>
    );
};

Component.displayName = 'UserProfileDocumentsItem';

Component.propTypes = {
    item: PropTypes.object
};

export default errorBoundary(Component);
