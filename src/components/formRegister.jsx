import React from 'react';

export default class FormReg extends React.Component {
  render () {
    return (
      <form action='create' onSubmit={this.props.handler}>
        <h3>New to Trendolizer?</h3>
        <div className='row'>
          <input type='text' name='username' placeholder='Your login' pattern='^[a-zA-Z_-]+$' />
        </div>
        <div className='row'>
          <input type='email' name='email' placeholder='Your email' required />
        </div>
        <div className='row'>
          <input type='password' name='password' placeholder='Your password' pattern='^[0-9a-zA-Z_-]{3,12}$' />
        </div>
        <div className='row'>
          <input type='submit' className='button is-alt' value='Create account' />
        </div>
      </form>
    );
  }
}