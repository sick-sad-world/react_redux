// Import utility stuff
// ===========================================================================
import { defaultInterface, defaultFrequency } from '../defaults';
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape, stateNum } from 'common/typecheck';

// Import Child components
// ===========================================================================
import statefullForm, { injectedProps } from 'common/hocs/statefull-form';
import SectionWrapper from 'common/section';
import Confirmation from 'common/components/confirmation';
import { ColumnsContainer } from 'src/columns';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';
import { EmailBcc } from 'src/user';

class EditAlert extends React.Component {

  getEmailRecipient(emails, state, props, newEmail) {
    return newEmail;
  }

  render() {
    const { loading, changed, values, texts, backUrl, reset, submit, bindInput, frequencyOptions, makeUpdater } = this.props;
    const title = (values.name) ? `${texts.title} "${values.name}"` : texts.title;
    return (
      <SectionWrapper title={title} description={texts.description} url={backUrl}>
        {(changed.length) ? (
          <Confirmation text={texts.confirmation} changed={changed} apply={submit} cancel={reset} />
        ) : null}
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Alert name'
              disabled={loading}
              {...bindInput('name')}
            />
            <Toggler
              label='Status'
              className='row-flex'
              togglerClassName='size-180'
              disabled={loading}
              name='active'
              options={[
                { label: 'Active', value: 1 },
                { label: 'Inactive', value: 0 }
              ]}
              {...bindInput('active')}
            />
            <Dropdown
              label='Frequency'
              disabled={loading}
              className='row-flex-wrap'
              selectClassName='size-120'
              name='frequency'
              options={frequencyOptions}
              desc={<span>Check column(s) for new items every <i>x</i> minutes</span>}
              {...bindInput('frequency')}
            />
            <ColumnsContainer schema={{ value: 'id', label: 'name' }}>
              {({ payload }) => (
                <Dropdown
                  label='Columns assigment'
                  disabled={loading}
                  className='row'
                  name='columns'
                  options={payload}
                  multi={true}
                  desc='Watched columns (click on columns in the list to watch them too)'
                  {...bindInput('columns')}
                />
              )}
            </ColumnsContainer>
          </div>
          <div className='form-block'>
            <div className='row'>
              <h3 className='form-subtitle'>Email assigment:</h3>
              <p>Currently this alert is going to: <b>{values.recipient}</b></p>
              <EmailBcc
                disabled={loading}
                active={values.recipient}
                onChange={makeUpdater('recipient', this.getEmailRecipient)}
                onClick={makeUpdater('recipient')}
                description='All alerts will be sent to the main email address  [{email}] associated with this account.  Use the form above to add an extra recipient.'
              />
            </div>
          </div>
        </form>
      </SectionWrapper>
    );
  }
}

EditAlert.defaultProps = {
  frequencyOptions: defaultFrequency
};

EditAlert.propTypes = {
  texts: PropTypes.objectOf(PropTypes.string).isRequired,
  backUrl: PropTypes.string.isRequired,
  state: stateNum.isRequired,
  frequencyOptions: optionShape('number'),
  ...injectedProps
};

export default statefullForm({
  propTypes: {
    data: PropTypes.shape(defaultInterface).isRequired
  }
})(EditAlert);
