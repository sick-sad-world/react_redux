import React from 'react';
import { ListItemButton } from 'common/components/list';

// Button to delete feed
// ===========================================================================
export function DeleteFeed(props) {
  return <ListItemButton {...props} />;
}

DeleteFeed.defaultProps = {
  title: 'Delete this source',
  icon: 'trash'
};

// Button to pick a feed
// ===========================================================================
export function SelectFeed(props) {
  return <ListItemButton {...props} />;
}

SelectFeed.defaultProps = {
  title: 'Select this source',
  icon: 'select'
};

// Button to deselect a feed
// ===========================================================================
export function DeselectFeed(props) {
  return <ListItemButton {...props} />;
}

DeselectFeed.defaultProps = {
  title: 'Deselect this source',
  icon: 'deselect'
};
