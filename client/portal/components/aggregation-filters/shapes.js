const { PropTypes } = window.WarpJS.ReactUtils;

export const SELECTION = PropTypes.shape({
    relnId: PropTypes.number,
    entityId: PropTypes.number,
    firstLevelId: PropTypes.number,
    secondLevelId: PropTypes.number
});

export const SUB_ITEM = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
});

export const ITEM = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(SUB_ITEM)
});

export const ENTITY = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(ITEM).isRequired
});

export const RELATIONSHIP = PropTypes.shape({
    id: PropTypes.number.isRequired,
    entities: PropTypes.arrayOf(ENTITY).isRequired
});
