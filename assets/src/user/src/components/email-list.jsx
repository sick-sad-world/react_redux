// Import helpers
// ===========================================================================
import { bindAll, without, includes } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import child components
// ===========================================================================
import Icon from 'common/components/icon';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
export default class EmailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new: ''
    };
    bindAll(this, 'makeListItem', 'addEmail', 'makeActionHandler');
  }

  // Create list item DOM element -> used in render method
  // ===========================================================================
  makeListItem(email, i) {
    const isActive = email === this.props.active;

    return (
      <li
        key={`email_${i}`}
        className={classNames({
          'is-disabled': this.props.disabled,
          'is-selected': isActive
        })}
        onClick={this.makeActionHandler(email, isActive)}
      >
        {email}
        <a onClick={() => this.props.onChange(without(this.props.data, email))}><Icon icon='cross'/></a>
      </li>
    );
  }

  makeActionHandler(email, isActive) {
    return (this.props.onClick) ? () => this.props.onClick((isActive ? this.props.email : email)) : null;
  }

  addEmail(e) {
    e.preventDefault();
    if (includes(this.props.data, this.state.new)) {
      if (this.props.onError instanceof Function) this.props.onError('You already have this email in list, try another one.');
    } else {
      this.props.onChange([...this.props.data, this.state.new]);
    }
    this.setState({ new: '' });
  }

  render() {
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
            onChange={e => this.setState({ new: e.target.value })}
          />
          <a disabled={this.props.disabled} className='button is-accent size-90' onClick={this.addEmail}>Add new</a>
        </div>
        <div className='form-description'>{this.props.description.replace('{email}', this.props.email)}</div>
      </div>
    );
  }
}

// Default props to component
// ===========================================================================
EmailList.defaultProps = {
  onChange: null,
  onError: null,
  onClick: null,
  active: null,
  disabled: false,
  description: 'if E-mail list is empty. Use form below to create one. If not - your profile e-mail [{email}] will be used as default.',
  emailValidator: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
  emptyTpl: <li className='is-default'>No email bcc created yet. All alerts/reports will be sended to main email.</li>
};

EmailList.propTypes = {
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onClick: PropTypes.func,
  email: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  active: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailValidator: PropTypes.instanceOf(RegExp).isRequired,
  emptyTpl: PropTypes.element.isRequired
};
