import React from 'react';
import PropTypes from 'prop-types';
import FormSubmit from 'common/components/forms/form-submit';

export default function FormLogin({ handler, loading }) {
  const onSubmit = (e) => {
    e.preventDefault();
    handler({
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    });
  };

  return (
    <form action='login' className='login' onSubmit={onSubmit}>
      <h3>Log in</h3>
      <div className='row'>
        <input type='text' name='username' placeholder='Your login' required />
      </div>
      <div className='row-flex'>
        <input type='password' name='password' placeholder='Your password' required />
        <FormSubmit text='Log in' loading={loading} className='button is-alt' />
      </div>
    </form>
  );
}

FormLogin.defaultProps = {
  loading: false
};

// Proptypes validation
// ===========================================================================
FormLogin.propTypes = {
  handler: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};
