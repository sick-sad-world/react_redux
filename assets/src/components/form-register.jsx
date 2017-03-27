import React from 'react';

export default function FormReg (props) {
  return (
    <form action='create' onSubmit={props.handler}>
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