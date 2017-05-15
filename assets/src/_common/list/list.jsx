// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import Icon from '../components/icon';

function PayloadList({ children, emptyText }) {
  return (
    <ul className='subsection-content entity-list'>
      {(children) ? children() : (<li className='state-empty'><Icon icon='emoji-sad' />{emptyText}</li>)}
    </ul>
  );
}

PayloadList.defaultProps = {
  emptyText: 'No items in list'
};

PayloadList.propTypes = {
  emptyText: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default SortableContainer(PayloadList);
