import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icon';

// Delete confirmation simple dialog
// ===========================================================================
export default function DeleteConfirmation({ key, children, accept, close }) {
  return (
    <div className='overlay' key={key}>
      <span onClick={close} className='close-handler'></span>
      <section className='small-popup confirmation-dialog'>
        <header>
          <h4>Confirm deleting?</h4>
          <a className='close' onClick={close}>
            <Icon icon='cross' />
          </a>
        </header>
        <main>
          {children}
        </main>
        <footer>
          <a onClick={accept} className='button is-accent'>Delete</a>
          <a onClick={close} className='button'>Cancel</a>
        </footer>
      </section>
    </div>
  );
}

DeleteConfirmation.defaultProps = {
  key: 'deleting'
};

DeleteConfirmation.propTypes = {
  key: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  accept: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
