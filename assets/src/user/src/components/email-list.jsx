// Import helpers
// ===========================================================================
import { bindAll, without, includes } from 'lodash';
import classNames from 'classnames';
import { emailRegExp, webHookRegExp } from 'common/typecheck';

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
      error: null,
      new: ''
    };
    bindAll(this, 'makeListItem', 'addEmail', 'errorHandler');
  }

  componentWillReceiveProps() {
    this.setState({ error: null });
  }

  errorHandler(error) {
    return this.setState({ error }, () => {
      if (this.props.onError) this.props.onError(error);
    });
  }

  // Create list item DOM element -> used in render method
  // ===========================================================================
  makeListItem(email, i) {
    const isActive = email === this.props.active;
    return (
      <li
        key={`email_${i}`}
        className={classNames({ 'is-disabled': this.props.disabled, 'is-selected': isActive })}
        onClick={(this.props.onClick) ? () => this.props.onClick((isActive ? this.props.email : email)) : null}
      >
        <span className='t-ellipsis'>{email}</span>
        <a onClick={() => this.props.onChange(without(this.props.data, email), false)}><Icon icon='cross'/></a>
      </li>
    );
  }

  addEmail(e) {
    e.preventDefault();
    let error = false;
    const { emailValidator, slackValidator } = this.props;
    const newItem = this.state.new;
    if (includes(this.props.data, newItem)) {
      error = 'You already have this email in list, try another one.';
    } else if (!emailValidator.test(newItem) && !slackValidator.test(newItem)) {
      error = 'This should be a valid email address or Slack webhook url (starting with "https://hooks.slack.com/services")';
    } else {
      this.props.onChange([...this.props.data, newItem], newItem);
    }

    if (error) {
      this.errorHandler(error);
    } else {
      this.setState({ new: '', error: null });
    }
  }

  render() {
    return (
      <div className='mod-email-list'>
        <div className='row-flex'>
          <input
            disabled={this.props.disabled}
            type='text'
            placeholder='Enter an email address or Slack webhook link'
            value={this.state.new}
            onChange={e => this.setState({ new: e.target.value })}
          />
          <a disabled={this.props.disabled} className='button is-accent size-90' onClick={this.addEmail}>Add new</a>
        </div>
        {(this.state.error) ? (<span className='warning'><Icon viewBox='0 0 24 24' icon='warning' />{this.state.error}</span>) : null }
        <ul className='tag-list row'>
          { (this.props.data.length) ? this.props.data.map(this.makeListItem) : this.props.emptyTpl }
        </ul>
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
  emailValidator: emailRegExp,
  slackValidator: webHookRegExp,
  emptyTpl: <li className='is-default'>No extra recipients added to this account yet.</li>
};

// Prop type check
// ===========================================================================
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
  slackValidator: PropTypes.instanceOf(RegExp).isRequired,
  emptyTpl: PropTypes.element.isRequired
};
