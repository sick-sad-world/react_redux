// Import utility stuff
// ===========================================================================
import { defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import TextInput from 'common/components/forms/input-text';
import SectionWrapper from 'common/section';
import Confirmation from 'common/components/confirmation';
import statefullForm, { injectedProps } from 'common/hocs/statefull-form';
import EmailList from './email-list';

class EditUser extends React.Component {

  render() {
    const { loading, values, changed, texts, bindInput, makeUpdater, submit, reset } = this.props;
    return (
      <SectionWrapper title='User settings' description={texts.description}>
        {(changed.length || loading) ? (
          <Confirmation text={texts.confirmation} changed={changed} loading={loading} apply={submit} cancel={reset} />
        ) : null}
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='fullname'
              label='Fullname'
              disabled={loading}
              {...bindInput('fullname')}
            />
            <TextInput
              className='row'
              name='position'
              label='Position'
              disabled={loading}
              {...bindInput('position')}
            />
            <TextInput
              className='row'
              name='email'
              type='email'
              label='Email'
              disabled={loading}
              {...bindInput('email')}
            />
            <div className='row'>
              <h3 className='form-subtitle'>Email BCC assigment:</h3>
              <EmailList
                email={values.email}
                data={values.email_bcc}
                onChange={makeUpdater('email_bcc')}
              />
            </div>
          </div>
        </form>
      </SectionWrapper>
    );
  }
}

// Edit profile form prop types checks
// ===========================================================================
EditUser.propTypes = {
  ...injectedProps
};

export default statefullForm({
  mapStateToData({ name, ...data }) {
    return data;
  },
  propTypes: {
    data: PropTypes.shape(defaultInterface).isRequired
  }
})(EditUser);
