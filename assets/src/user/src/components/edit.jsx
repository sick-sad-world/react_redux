// Import utility stuff
// ===========================================================================
import { defaultData, defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import TextInput from 'common/components/forms/input-text';
import MakeEditForm, { injectedPropsType } from 'common/components/edit-form-hoc';
import EmailList from './email-list';

class EditUser extends React.Component {

  static getTypeCheck() {
    return {
      data: PropTypes.shape(defaultInterface).isRequired
    };
  }

  static mapDataToState(data) {
    return {
      changed: [],
      fullname: data.fullname,
      email: data.email,
      position: data.position,
      email_bcc: data.email_bcc
    };
  }

  render() {
    const { running, formValues, updateState, onEmailBccError } = this.props;
    return (
      <form className='subsection-content columned'>
        <div className='form-block'>
          <TextInput
            className='row'
            name='fullname'
            label='Fullname'
            disabled={running}
            value={formValues.fullname}
            onChange={updateState('fullname')}
          />
          <TextInput
            className='row'
            name='position'
            label='Position'
            disabled={running}
            value={formValues.position}
            onChange={updateState('position')}
          />
          <TextInput
            className='row'
            name='email'
            type='email'
            label='Email'
            disabled={running}
            value={formValues.email}
            onChange={updateState('email')}
          />
          <div className='row'>
            <h3 className='form-subtitle'>Email BCC assigment:</h3>
            <EmailList
              email={formValues.email}
              data={formValues.email_bcc}
              onChange={updateState('email_bcc')}
              onError={onEmailBccError}
              />
          </div>
        </div>
      </form>
    );
  }
}

// Edit profile form prop types checks
// ===========================================================================
EditUser.propTypes = {
  onEmailBccError: PropTypes.func,
  ...injectedPropsType
};

export default MakeEditForm(EditUser);
