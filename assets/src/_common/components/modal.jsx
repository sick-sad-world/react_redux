import React from 'react';
import PropTypes from 'prop-types';
import { childrenShape } from '../typecheck';
import { Close } from './buttons';

// Delete confirmation simple dialog
// ===========================================================================
export default function Modal({ children, close, title, className }) {
  return (
    <div className='overlay'>
      <span onClick={close} className='close-handler'></span>
      <section className={className}>
        <header>
          <h4>{title}</h4>
          <Close className='close' onClick={close} />
        </header>
        {children}
      </section>
    </div>
  );
}

Modal.defaultProps = {

};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: childrenShape.isRequired,
  className: PropTypes.string,
  close: PropTypes.func.isRequired
};
