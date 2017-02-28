import React from 'react';

export default function FormLogin (props) {
  return (
    <form action='login' onSubmit={props.handler}>
      <h3>Log in</h3>
      <div className='row'>
        <input type='text' name='username' placeholder='Your login' pattern='^[a-zA-Z_-]+$' />
      </div>
      <div className='row-flex'>
        <input type='password' name='password' placeholder='Your password' pattern='^[0-9a-zA-Z_-]{3,12}$' />
        <input type='submit' className='button is-alt' value='Log in' />
      </div>
    </form>
  );
}