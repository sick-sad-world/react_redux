import React from 'react';
import Icon from './icon';
import Modal from 'react-modal';

// Delete confirmation simple dialog
// ===========================================================================
export default function DeleteConfirmation ({children, accept, close}) {
  return (
    <div className='overlay'>
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