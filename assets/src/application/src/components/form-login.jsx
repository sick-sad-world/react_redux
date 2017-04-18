import React from 'react';
import PropTypes from 'prop-types';

export default function FormLogin({ handler }) {
  return (
    <form action='login' onSubmit={handler}>
      <h3>Log in</h3>
      <div className='row'>
        <input type='text' name='username' placeholder='Your login' required />
      </div>
      <div className='row-flex'>
        <input type='password' name='password' placeholder='Your password' required />
        <input type='submit' className='button is-alt' value='Log in' />
      </div>
    </form>
  );
}

// Proptypes validation
// ===========================================================================
FormLogin.propTypes = {
  handler: PropTypes.func.isRequired
};
