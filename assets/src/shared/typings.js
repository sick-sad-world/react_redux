import PropTypes from 'prop-types';

/** Default options shape for Dropdowns, switchers, e.t.c */
export const optionShape = (type = 'string', labelProp = 'label') => PropTypes.arrayOf(PropTypes.shape({
  [labelProp]: PropTypes.string.isRequired,
  value: PropTypes[type].isRequired
}));

/** All possible variations of ClassNames definitions based on classNames https://github.com/JedWatson/classnames */
export const classNameShape = PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.objectOf(PropTypes.bool)]);
