import React from 'react';
import PropTypes from 'prop-types';

export default function FormReg({ handler }) {
  return (
    <form action='create' onSubmit={(e) => {
      e.preventDefault();
      const { name, email, password } = e.target.elements;
      handler({
        name: name.value,
        email: email.value,
        password: password.value
      }).then(() => {
        name.value = '';
        email.value = '';
        password.value = '';
      });
    }}>
      <h3>New to Trendolizer?</h3>
      <div className='row'>
        <input type='text' name='name' placeholder='Your login' required />
      </div>
      <div className='row'>
        <input type='email' name='email' placeholder='Your email' required />
      </div>
      <div className='row'>
        <input type='password' name='password' placeholder='Your password' required />
      </div>
      <div className='row'>
        <input type='submit' className='button is-alt' value='Create account' />
      </div>
    </form>
  );
}

// Proptypes validation
// ===========================================================================
FormReg.propTypes = {
  handler: PropTypes.func.isRequired
};
