import React from 'react';
import { ListItemButton } from 'common/components/list';

// Button to expand set
// ===========================================================================
export function ExpandSet(props) {
  return <ListItemButton {...props} />;
}

ExpandSet.defaultProps = {
  title: 'View contents',
  icon: 'chevron-down'
};

// Button to collpase set
// ===========================================================================
export function CollapseSet(props) {
  return <ListItemButton {...props} />;
}

CollapseSet.defaultProps = {
  title: 'Hide contents',
  icon: 'chevron-up'
};

// Button to pick a set
// ===========================================================================
export function SelectSet(props) {
  return <ListItemButton {...props} />;
}

SelectSet.defaultProps = {
  title: 'Select this set',
  icon: 'select-all'
};

// Button to deselect a set
// ===========================================================================
export function DeselectSet(props) {
  return <ListItemButton {...props} />;
}

DeselectSet.defaultProps = {
  title: 'Deselect this set',
  icon: 'deselect'
};
