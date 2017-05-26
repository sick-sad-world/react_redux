import React from 'react';
import PropTypes from 'prop-types';
import Modal from './modal';

// Delete confirmation simple dialog
// ===========================================================================
export default function DeleteConfirmation({ children, accept, close }) {
  return (
    <Modal close={close} title='Confirm deleting?' className='popup confirmation-dialog'>
        <main>
          {children}
        </main>
        <footer>
          <a onClick={accept} className='button is-accent'>Delete</a>
          <a onClick={close} className='button'>Cancel</a>
        </footer>
    </Modal>
  );
}

DeleteConfirmation.propTypes = {
  children: PropTypes.element.isRequired,
  accept: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
