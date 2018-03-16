import React from 'react';
import PropTypes from 'prop-types';

export default function DataListRow({children, ...props}) {
  return (
    <li>
      <div>
        {...props}
      </div>
      {children}
    </li>
  );
}