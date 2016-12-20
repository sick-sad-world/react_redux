// Import React related stuff
// ===========================================================================
import React from 'React';

// Import child components
// ===========================================================================
import { Icon } from '../icon';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
export default class EmailList extends React.Component {

  // Create new email -> to [email_bcc] list
  // ===========================================================================
  createEmail (e) {
    e.preventDefault();
  }

  render () {
    // Decompose props
    // ===========================================================================
    let { email_bcc, email, disabled } = this.props;

    // Define empty template
    // ===========================================================================
    let empty = <li data-value={email} className='is-disabled'>{email}</li>;

    // Define component markup
    // ===========================================================================
    return (
      <div className={`mod-email-list ${this.props.className}`}>
        <ul className='tag-list'>
          { (email_bcc.length) ? email_bcc.map((email) => {
            return <li className={(disabled) ? 'is-disabled': null} data-value={email}>{email} <Icon icon='cross'/></li>;
          }) : empty }
        </ul>
        <div className='row-flex'>
          <input disabled={disabled} type='email' placeholder='Enter some email' pattern='/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/' />
          <button disabled={disabled} className='button is-accent size-90' onClick={this.createEmail.bind(this)}>Add new</button>
        </div>
        <small className='form-description'>
          E-mail list is empty. Use form below to create one. If not - your profile e-mail [{email}] will be used as default.
        </small>
      </div>
    );
  }
}