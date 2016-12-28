// Import React related stuff
// ===========================================================================
import { bindAll, concat, without, includes } from 'lodash';
import classNames from 'classnames';
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import child components
// ===========================================================================
import Icon from '../icon';

// Import actions
// ===========================================================================
import { updateData, throwError } from '../../actions/actions';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
class EmailList extends React.Component {
  constructor(props) {
    super(props);

    // Set component state
    // ===========================================================================
    this.state = {
      new: ''
    };

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      updateData: updateData('user'),
      throwError: throwError
    }, this.props.dispatch);  

    bindAll(this, ['createEmail', 'removeEmail']);
  }
  // Create new email -> to [email_bcc] list
  // ===========================================================================
  createEmail (e) {
    e.preventDefault();
    if (!this.props.emailValidator.test(this.state.new)) {
      this.actions.throwError('Plase provide correct email address as value.');
    } else if (includes(this.props.email_bcc, this.state.new) || this.props.email === this.state.new) {
      this.actions.throwError('You already have this email in list, try another one.');
    } else {
      this.actions.updateData({
        email_bcc: concat(this.props.email_bcc, this.state.new)
      }).then(() => this.setState({new: ''})).catch(this.actions.throwError);
    }
  }

  // Remove existing email -> from [email_bcc] list
  // ===========================================================================
  removeEmail (email) {
    this.actions.updateData({
      email_bcc: without(this.props.email_bcc, email)
    }).catch(this.actions.throwError);
  }

  render () {
    // Decompose props
    // ===========================================================================
    let { active, email_bcc, email, disabled, description, className, onClick } = this.props;

    // Define empty template
    // ===========================================================================
    let empty = this.props.empty || <li data-value={email} className='is-disabled'>{email}</li>;

    // Define component markup
    // ===========================================================================
    return (
      <div className={`mod-email-list ${className}`}>
        <ul className='tag-list'>
          { (email_bcc && email_bcc.length) ? email_bcc.map((email, i) => {
            // Specify classes for each item
            // ===========================================================================
            let className = classNames({
              'is-disabled': disabled,
              'is-selected': email === active
            });
            return (
              <li
                key={`email_${i}`}
                className={className}
                onClick={onClick}
                data-value={email}
              >
                {email}
                <a onClick={e => {
                  e.stopPropagation();
                  this.removeEmail(email);
                }}>
                  <Icon icon='cross'/>
                </a>
              </li>
            );
          }) : empty }
        </ul>
        <div className='row-flex'>
          <input
            disabled={disabled}
            type='email'
            placeholder='Enter some email'
            value={this.state.new}
            onChange={(e) => this.setState({new: e.target.value})}
          />
          <button disabled={disabled} className='button is-accent size-90' onClick={this.createEmail.bind(this)}>Add new</button>
        </div>
        <div className='form-description'>{description}</div>
      </div>
    );
  }
}

// Default props to component
// ===========================================================================
EmailList.defaultProps = {
  onClick: null,
  active: null,
  disabled: false,
  description: 'if E-mail list is empty. Use form below to create one. If not - your profile e-mail [{email}] will be used as default.',
  emailValidator: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
};

export default connect(({user}) => ({email: user.email, email_bcc: user.email_bcc}))(EmailList);