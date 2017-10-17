import React from 'react';
import PropTypes from 'prop-types';
import Modal from './modal';
import FormSubmit from './forms/form-submit.jsx';

// Delete confirmation simple dialog
// ===========================================================================
export default function DeleteConfirmation({ children, accept, close, loading }) {
  return (
    <Modal close={close} title='Please confirm' className='popup confirmation-dialog'>
        <main>
          {children}
        </main>
        <footer>
          <FormSubmit loading={loading} onClick={accept} className='button is-accent' text='Delete'/>
          <a onClick={close} className='button'>Cancel</a>
        </footer>
    </Modal>
  );
}

DeleteConfirmation.defaultProps = {
  loading: false
};

DeleteConfirmation.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  accept: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
