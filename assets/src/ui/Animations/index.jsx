import get from 'lodash/get';
import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import styles from './data';

export const defaultDuration = 250;

export default function Animation({ type, children, timeout, ...props }) {
  return (
    <Transition {...props} timeout={timeout}>
      {(state) => children({
        transitionDuration: `${timeout}ms`,
        ...get(styles, `${type}.default`),
        ...get(styles, `${type}.${state}`)
      })}
    </Transition>
  );
}

Animation.defaultProps = {
  timeout: defaultDuration
}

Animation.propTypes = {
  type: PropTypes.oneOf(Object.keys(styles)).isRequired,
  children: PropTypes.func.isRequired,
  timeout: PropTypes.number
}