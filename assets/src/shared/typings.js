import PropTypes from 'prop-types';

export const classNamesTyping = PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.objectOf(PropTypes.bool)]);

export const someTyping = true;
