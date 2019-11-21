import { NAME } from './../constants';

const { ActionIcon, Tooltip } = window.WarpJS.ReactComponents;
const { classnames, errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const classNames = classnames(
        'warpjs-aggregation-filters-search-field-selected',
        {
            [`warpjs-aggregation-filters-search-field-selected-level-${props.level}`]: true
        }
    );

    return (
        <div className={classNames}>
            <Tooltip title={props.label}><span className="warpjs-label">{props.label}</span></Tooltip>
            <ActionIcon glyph="remove" title={`Remove '${props.label}`} onClick={props.onClick} />
        </div>
    );
};

Component.displayName = `${NAME}SearchFieldMenuItem`;

Component.propTypes = {
    label: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
};

export default errorBoundary(Component);
