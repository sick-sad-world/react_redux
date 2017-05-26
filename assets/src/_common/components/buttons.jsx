import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icon';

// Agnostinc list item action button component
// @using by: ListView and Management views
// ===========================================================================
export default function IconBtn({ icon, ...props }) {
  return <a {...props}><Icon icon={icon} /></a>;
}

IconBtn.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  icon: PropTypes.string.isRequired
};

export function Close(props) {
  return <IconBtn {...props} icon='cross' />;
}

export function GoTo(props) {
  return <IconBtn {...props} icon='export' />;
}

export function Show(props) {
  return <IconBtn {...props} icon='eye-with-line' />;
}

export function Hide(props) {
  return <IconBtn {...props} icon='eye' />;
}

export function Expand(props) {
  return <IconBtn {...props} icon='chevron-down' />;
}

export function Collapse(props) {
  return <IconBtn {...props} icon='chevron-up' />;
}

export function Delete(props) {
  return <IconBtn {...props} icon='trash' />;
}

export function Select(props) {
  return <IconBtn {...props} icon='select' />;
}

export function Deselect(props) {
  return <IconBtn {...props} icon='deselect' />;
}

export function SelectAll(props) {
  return <IconBtn {...props} icon='select-all' />;
}

export function DeselectAll(props) {
  return <IconBtn {...props} icon='deselect' />;
}

export function Refresh(props) {
  return <IconBtn {...props} icon='cw' />;
}

export function Favorite(props) {
  return <IconBtn {...props} icon='star-outlined' />;
}

export function Unfavorite(props) {
  return <IconBtn {...props} icon='star' />;
}
