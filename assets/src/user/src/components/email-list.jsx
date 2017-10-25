// Import helpers
// ===========================================================================
import { bindAll, without, includes } from 'lodash';
import classNames from 'classnames';
import { emailRegExp, webHookRegExp } from 'common/typecheck';
import FormSubmit from 'common/components/forms/form-submit';

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
    bindAll(this, 'makeListItem', 'addEmail', 'removeError');
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
      this.setState({ error });
    } else {
      this.setState({ new: '', error: null });
    }
  }

  chooseEmail(email, isActive) {
    return (e) => {
      e.stopPropagation();
      this.props.onClick((isActive ? this.props.email : email));
    };
  }

  removeEmail(email) {
    return (e) => {
      e.stopPropagation();
      this.props.onChange(without(this.props.data, email), undefined);
    };
  }

  removeError() {
    this.setState({ error: null });
  }

  makeListItem(email, i) {
    const isActive = email === this.props.active;
    const isDisabled = this.props.disabled || this.props.loading;
    return (
      <li
        key={`email_${i}`}
        disabled={isDisabled}
        className={classNames({ 'is-disabled': isDisabled, 'is-selected': isActive })}
        onClick={(this.props.onClick) ? this.chooseEmail(email, isActive) : null}
      >
        <span className='t-ellipsis'>{email}</span>
        <a disabled={isDisabled} onClick={this.removeEmail(email)}><Icon icon='cross'/></a>
      </li>
    );
  }

  render() {
    const { disabled, loading, email, description, data, emptyTpl } = this.props;
    return (
      <div className='mod-email-list'>
        <div className='row-flex'>
          <input
            disabled={disabled}
            type='text'
            placeholder='Enter an email address or Slack webhook link'
            value={this.state.new}
            onChange={e => this.setState({ new: e.target.value })}
          />
          <FormSubmit className='button is-accent size-90' disabled={disabled} loading={loading} onClick={this.addEmail} text='Add new'/>
        </div>
        {(this.state.error) ? (<span className='warning' onClick={this.removeError}><Icon viewBox='0 0 24 24' icon='warning' />{this.state.error}</span>) : null }
        <ul className='tag-list row'>
          { (data.length) ? data.map(this.makeListItem) : emptyTpl }
        </ul>
        {(description) ? <div className='form-description'>{description.replace('{email}', email)}</div> : null }
      </div>
    );
  }
}

// Default props to component
// ===========================================================================
EmailList.defaultProps = {
  error: null,
  onChange: null,
  onClick: null,
  active: null,
  loading: false,
  disabled: false,
  description: 'if E-mail list is empty. Use form below to create one. If not - your profile e-mail [{email}] will be used as default.',
  emailValidator: emailRegExp,
  slackValidator: webHookRegExp,
  emptyTpl: <li className='is-default'>No extra recipients added to this account yet.</li>
};

// Prop type check
// ===========================================================================
EmailList.propTypes = {
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  email: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  active: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailValidator: PropTypes.instanceOf(RegExp).isRequired,
  slackValidator: PropTypes.instanceOf(RegExp).isRequired,
  emptyTpl: PropTypes.element.isRequired
};
