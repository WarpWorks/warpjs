const { PropTypes } = window.WarpJS.ReactUtils;

export const relationship = PropTypes.shape({
    items: PropTypes.array,
    label: PropTypes.string
});
