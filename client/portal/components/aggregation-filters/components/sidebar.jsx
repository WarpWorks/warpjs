import Relationship from './relationship';
import { NAME } from './../constants';

const { PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => props.filters.map((reln) => <Relationship key={reln.id} reln={reln} />);

Component.displayName = `${NAME}Sidebar`;

Component.propTypes = {
    filters: PropTypes.array.isRequired
};

export default errorBoundary(Component);
