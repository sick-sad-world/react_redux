// Import React related stuff
// ===========================================================================
import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';

export function PayloadList({ children, emptyTpl, ...props }) {
  return (
    <div {...props}>
      {(children.length) ? children : emptyTpl}
    </div>
  );
}

PayloadList.defaultProps = {
  className: 'list-container',
  emptyTpl: <div className='state-empty'>No columns visible on a Dashboard</div>
};

PayloadList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  emptyTpl: PropTypes.element.isRequired
};

export default SortableContainer(PayloadList);
