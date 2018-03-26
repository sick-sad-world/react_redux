import React from 'react';
import PropTypes from 'prop-types';
import { childrenShape } from 'shared/typings';

export default function Fieldset({ title, error, collapsable, children, ...props }) {
  return (
    <fieldset>
      {title && <legend>{title}</legend>}
      {children}
      {error && <span >{error}</span>}
    </fieldset>
  );
}

Fieldset.defaultProps = {
  collapsable: false
}

Fieldset.propTypes = {
  /** Contents of fieldset */
  children: childrenShape,
  /** Define whatever fieldset should be able to collapse in accordion style */
  collapsable: PropTypes.bool.isRequired,
  /** Title of fieldset - rendered as <legend/> */
  title: PropTypes.string,
  /** Error message that may be shown */
  error: PropTypes.string
}