import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';

import { classNameShape, errorShape } from '../../shared/typings';

import 'node_modules/react-select/dist/react-select.css';
import './styles.scss';
import IconButton from '../IconButton';

export default function Dropdown({label, name, focus, error, className, descr,  ...props}) {
  const classes = {
    'state--error': !!error,
    'state--focus': !!focus
  };

  return (
    <div className={classNames('Dropdown--root', classes, className)}>
      {label && <label>{label}</label>}
      <Select
        {...props}
        arrowRenderer={({ onMouseDown, isOpen }) => <IconButton onMouseDown={onMouseDown} g={(isOpen) ? 'chevron-up' : 'chevron-down'} />}
      />
      {(error || descr) ? (
        <span className='subtext'>{error || descr}</span>
      ) : null}
    </div>
  )
}

Dropdown.defaultProps = {

};

Dropdown.propTypes = {
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Name property for input */
  name: PropTypes.string.isRequired,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** Whatever field is focused or not */
  focus: PropTypes.bool.isRequired,
  /** Field validation state mark it as valid [true] or invalid [Array[String]] */
  error: errorShape.isRequired
};