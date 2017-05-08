import React from 'react';
import PropTypes from 'prop-types';
import { ListItemButton } from 'common/components/list';

// Button to delete feed
// ===========================================================================
export function ToggleVisibility({ open, buttonData, handler }) {
  return <ListItemButton {...buttonData[open]} handler={handler} />;
}

ToggleVisibility.defaultProps = {
  open: 1,
  buttonData: [{ icon: 'eye-with-line', title: 'Show this column' }, { icon: 'eye', title: 'Hide this column' }]
};

ToggleVisibility.propTypes = {
  open: PropTypes.number.isRequired,
  buttonData: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })),
  handler: PropTypes.func.isRequired
};
