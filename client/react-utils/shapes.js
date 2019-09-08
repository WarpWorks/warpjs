import PropTypes from 'prop-types';

export const relationship = PropTypes.shape({
    items: PropTypes.array,
    label: PropTypes.string
});

export const link = PropTypes.shape({
    href: PropTypes.string,
    title: PropTypes.string
});
