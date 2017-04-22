// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { defaultData, defaultInterface } from '../defaults';
import { stateNum } from 'common/typecheck';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import TextInput from 'common/components/forms/input-text';
import EditForm from 'common/components/edit-form';
import EmailList from './email-list';

export default class EditUser extends EditForm {
  mapDataToState(data) {
    return {
      changed: [],
      fullname: data.fullname,
      email: data.email,
      position: data.position,
      email_bcc: data.email_bcc
    };
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    const running = this.props.state > 2;

    return (
      <section className={classNames({
        'mod-subsection-edit': true,
        'state-loading': running
      })}>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{this.props.texts.title}</h1>
            <p>{this.props.texts.description}</p>
          </div>
        </header>
        { this.renderConfirmation() }
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='fullname'
              label='Fullname'
              disabled={running}
              value={this.state.fullname}
              onChange={this.updateState('fullname')}
            />
            <TextInput
              className='row'
              name='position'
              label='Position'
              disabled={running}
              value={this.state.position}
              onChange={this.updateState('position')}
            />
            <TextInput
              className='row'
              name='email'
              type='email'
              label='Email'
              disabled={running}
              value={this.state.email}
              onChange={this.updateState('email')}
            />
            <div className='row'>
              <h3 className='form-subtitle'>Email BCC assigment:</h3>
              <EmailList
                email={this.state.email}
                data={this.state.email_bcc}
                onChange={this.updateState('email_bcc')}
                onError={this.props.onEmailBccError}
                />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

// Edit profile form default props
// ===========================================================================
EditUser.defaultProps = {
  texts: {
    title: 'Profile settings',
    description: 'Tell us a bit about yourself...',
    confirmation: '{data} was changed. Save changes?'
  },
  data: { ...defaultData }
};

// Edit profile form prop types checks
// ===========================================================================
EditUser.propTypes = {
  state: stateNum.isRequired,
  data: PropTypes.shape(defaultInterface).isRequired
};