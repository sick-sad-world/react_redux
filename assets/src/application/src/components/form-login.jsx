import React from 'react';
import PropTypes from 'prop-types';
import FormSubmit from 'common/components/forms/form-submit';

export default function FormLogin({ handler, loading }) {
  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;
    handler({
      username: username.value,
      password: password.value
    });
  };

  return (
    <form action='login' className='login' onSubmit={onSubmit}>
      <div className='row'>
        <input type='text' name='username' placeholder='Your login' required />
      </div>
      <div className='row-flex'>
        <input type='password' name='password' placeholder='Your password' required />
        <FormSubmit text='Submit' loading={loading} className='button is-alt' />
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
