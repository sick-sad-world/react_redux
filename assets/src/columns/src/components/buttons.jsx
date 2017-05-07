import React from 'react';
import { ListItemButton } from 'common/components/list';

// Button to delete feed
// ===========================================================================
export function ToggleVisibility({ open, buttonData, handler }) {
  return <ListItemButton {...buttonData[open]} handler={handler} />;
}

ToggleVisibility.defaultProps = {
  buttonData: [{ icon: 'eye', title: 'Show this column' }, { icon: 'eye-with-line', title: 'Hide this column' }]
};
