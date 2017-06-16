import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';

function ItemWrapper({ children, style }) {
  return (
    <div style={style} >{children}</div>
  );
}

ItemWrapper.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

export default SortableElement(ItemWrapper);
