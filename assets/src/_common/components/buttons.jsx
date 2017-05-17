import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icon';

// Agnostinc list item action button component
// @using by: ListView and Management views
// ===========================================================================
export default function ListItemButton({ title, handler, icon }) {
  return <a onClick={handler} title={title}><Icon icon={icon} /></a>;
}

ListItemButton.propTypes = {
  title: PropTypes.string,
  handler: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired
};

export function Show(props) {
  return <ListItemButton {...props} icon='eye-with-line' />;
}

export function Hide(props) {
  return <ListItemButton {...props} icon='eye' />;
}

export function Expand(props) {
  return <ListItemButton {...props} icon='chevron-down' />;
}

export function Collapse(props) {
  return <ListItemButton {...props} icon='chevron-up' />;
}

export function Delete(props) {
  return <ListItemButton {...props} icon='trash' />;
}

export function Select(props) {
  return <ListItemButton {...props} icon='select' />;
}

export function Deselect(props) {
  return <ListItemButton {...props} icon='deselect' />;
}

export function SelectAll(props) {
  return <ListItemButton {...props} icon='select-all' />;
}

export function DeselectAll(props) {
  return <ListItemButton {...props} icon='deselect' />;
}

export function Refresh(props) {
  return <ListItemButton {...props} icon='cw' />;
}

export function Favorite(props) {
  return <ListItemButton {...props} icon='star-outlined' />;
}

export function Unfavorite(props) {
  return <ListItemButton {...props} icon='star' />;
}
