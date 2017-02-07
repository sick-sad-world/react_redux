// Import helpers
// ===========================================================================
import { bindAll, without, includes } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';

// Import child components
// ===========================================================================
import Icon from '../icon';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
export default class EmailList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      new: ''
    };
    bindAll(this, 'makeListItem', 'addEmail', 'makeActionHandler');
  }

  // Create list item DOM element -> used in render method
  // ===========================================================================
  makeListItem (email, i) {
    let isActive = email === this.props.active;
    let className = classNames({
      'is-disabled': this.props.disabled,
      'is-selected': isActive
    });

    return (
      <li key={`email_${i}`} className={className} onClick={this.makeActionHandler(email, isActive)} >
        {email}
        <a onClick={() => this.props.onChange(without(this.props.data, email))}><Icon icon='cross'/></a>
      </li>
    );
  }

  makeActionHandler (email, isActive) {
    return (this.props.action) ? () => this.props.action((isActive ? this.props.email : email)) : null;
  }

  addEmail (e) {
    e.preventDefault();
    if (includes(this.props.data, this.state.new)) {
      if (this.props.onError instanceof Function ) this.props.onError('You already have this email in list, try another one.');
    } else {
      this.props.onChange([...this.props.data, this.state.new]);
    }
    this.setState({new: ''});
  }

  render () {
    return (
      <div className='mod-email-list'>
        <ul className='tag-list row'>
          { (this.props.data.length) ? this.props.data.map(this.makeListItem) : this.props.emptyTpl }
        </ul>
        <div className='row-flex'>
          <input
            disabled={this.props.disabled}
            type='email'
            placeholder='Enter some email'
            value={this.state.new}
            onChange={(e) => this.setState({new: e.target.value})}
          />
          <button disabled={this.props.disabled} className='button is-accent size-90' onClick={this.addEmail}>Add new</button>
        </div>
        <div className='form-description'>{this.props.description.replace('{email}', this.props.email)}</div>
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
  emailValidator: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
  emptyTpl: <li className='is-default'>No email bcc created yet. All alerts/reports will be sended to main email.</li>
};