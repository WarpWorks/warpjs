import And from './../and';

const Component = (props) => {
    return (
        <React.Fragment> <And /> <span className="warpjs-individual-contribution-names-more">{props.moreUsers} more</span></React.Fragment>
    );
};

export default Component;
