import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';

function PayloadItem({ children, width, ...props }) {
  const w = `${width}px`;
  return (
    <div style={{ width: w, position: 'relative', flex: `0 0 ${w}` }} {...props}>{children}</div>
  );
}

PayloadItem.propTypes = {
  width: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired
};

export default SortableElement(PayloadItem);
