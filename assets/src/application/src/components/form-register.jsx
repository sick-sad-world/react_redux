import React from 'react';
import PropTypes from 'prop-types';
import FormSubmit from 'common/components/forms/form-submit';

export default function FormReg({ handler, loading }) {
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = e.target.elements;
    handler({
      name: name.value,
      email: email.value,
      password: password.value
    });
  };

  return (
    <form action='create' className='register' onSubmit={onSubmit}>
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
        <FormSubmit text='Create account' loading={loading} className='button is-alt' />
      </div>
    </form>
  );
}
FormReg.defaultProps = {
  loading: false
};

// Proptypes validation
// ===========================================================================
FormReg.propTypes = {
  handler: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};
