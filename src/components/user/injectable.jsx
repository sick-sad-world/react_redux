import React from 'React';
import { connect } from 'react-redux';
import { Icon } from '../icon';


class EmailList extends React.Component {
  createEmail () {

  }

  render () {
    let { email_bcc, email } = this.props;
    let empty = <li data-value={email} className='is-disabled'>{email}</li>;
    return (
      <div className={`mod-email-list ${this.props.className}`}>
        <ul className='tag-list'>
          { (email_bcc.length) ? email_bcc.map((email) => <li data-value={email}>{email} <Icon icon='cross'/></li>) : empty }
        </ul>
        <div className='row-flex'>
          <input type='email' placeholder='Enter some email' pattern='/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/' />
          <button className='size-90' onClick={this.createEmail}>Add new</button>
        </div>
        <small className="form-description">
          E-mail list is empty. Use form below to create one. If not - your profile e-mail [{email}] will be used as default.
        </small>
      </div>
    );
  }
}

export default connect(({user}) => ({email: user.email, email_bcc: user.email_bcc}))(EmailList);