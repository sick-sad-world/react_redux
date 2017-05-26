import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// Hottnes colored bar
// ===========================================================================
export default function HotnessBar({ value }) {
  return (
    <span style={{ paddingRight: (value > 1) ? 0 : `${100 - (value * 100)}%` }} className={classNames('color-bar', { 'is-new': value > 1 })}></span>
  );
}

HotnessBar.defaultProps = {
  colorRange: [0.3, 0.5, 0.75, 0.99999],
  texts: [
    'These story is not "hot" anymore',
    'A bit hot, but past it prime',
    'This is "hot" story',
    'This is very "hot" story',
    'Be careful this is "new" story and result may be different'
  ]
};

HotnessBar.propTypes = {
  value: PropTypes.number.isRequired,
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorRange: PropTypes.arrayOf(PropTypes.number).isRequired
};
