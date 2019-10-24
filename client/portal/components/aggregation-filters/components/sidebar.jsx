import Relationship from './relationship';
import { NAME } from './../constants';

const { PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => props.aggregationFilters.map((reln) => <Relationship key={reln.id} reln={reln} {...props} />);

Component.displayName = `${NAME}Sidebar`;

Component.propTypes = {
    aggregationFilters: PropTypes.array.isRequired
};

export default errorBoundary(Component);
