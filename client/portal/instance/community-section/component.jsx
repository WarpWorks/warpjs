const CommunityUser = require('./../community-user');
const ContextButton = require('./../context-button');

const CommunitySection = (props) => {
    const { users } = props;

    if (users && users.length) {
        const { page, title } = props;

        const communityUsers = props.users.map((user) => <CommunityUser key={user.id} user={user} />);

        return (
            <div className="col-xs-12 warpjs-page-view-side-section">
                <div className="row warpjs-title">
                    <div className="col-xs-12">{title}</div>
                </div>
                <div className="row warpjs-content">
                    <div className="col-xs-12">
                        {communityUsers}
                    </div>
                    <ContextButton page={page} elementId={title} elementType="Relationship" />
                </div>
            </div>
        );
    } else {
        return null;
    }
};

module.exports = CommunitySection;
