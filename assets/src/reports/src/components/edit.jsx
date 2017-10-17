// Import utility stuff
// ===========================================================================
import moment from 'moment';
import { defaultInterface, defaultFrequency } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';

// Import Child components
// ===========================================================================
import Datetime from 'react-datetime';
import { ColumnsContainer } from 'src/columns';
import statefullForm, { injectedProps } from 'common/hocs/statefull-form';
import SectionWrapper from 'common/section';
import Confirmation from 'common/components/confirmation';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';
import { EmailBcc } from 'src/user';

class EditReport extends React.Component {

  getEmailRecipient(emails, state, props, newEmail, ...args) {
    return newEmail;
  }

  getNextSend(value, state, props) {
    return (typeof value === 'string') ? value : value.format(props.timeFormat);
  }

  render() {
    const { loading, changed, values, texts, backUrl, reset, submit, bindInput, frequencyOptions, makeUpdater } = this.props;
    const title = (values.name) ? `${texts.title} "${values.name}"` : texts.title;
    const datePickerFormats = this.props.timeFormat.split(' ');

    return (
      <SectionWrapper title={title} description={texts.description} url={backUrl}>
        {(changed.length || loading) ? (
          <Confirmation text={texts.confirmation} loading={loading} changed={changed} apply={submit} cancel={reset} />
        ) : null}
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Report name'
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
            <div className='row-flex'>
              <label htmlFor='funReportNextSend'>Next send:</label>
              <Datetime
                value={values.next_send}
                dateFormat={datePickerFormats[0]}
                timeFormat={datePickerFormats[1]}
                inputProps={{
                  className: 'size-180',
                  disabled: loading,
                  name: 'next_send'
                }}
                {...bindInput('next_send', this.getNextSend)}
              />
            </div>
            <ColumnsContainer schema={{ value: 'id', label: 'name' }}>
              {({ payload }) => (
                <Dropdown
                  label='Columns assigment'
                  disabled={loading}
                  className='row'
                  name='columns'
                  options={payload}
                  multi={true}
                  {...bindInput('columns')}
                  desc='Watched columns (click on columns in the list to watch them too)'
                />
              )}
            </ColumnsContainer>
          </div>
          <div className='form-block'>
            <div className='row'>
              <h3 className='form-subtitle'>Email assigment:</h3>
              <p>Currently this report going to: <b>{values.recipient}</b></p>
              <EmailBcc
                loading={loading}
                active={values.recipient}
                onChange={makeUpdater('recipient', this.getEmailRecipient)}
                onClick={makeUpdater('recipient')}
                description='All reports will be sent to the main email address  [{email}] associated with this account.  Use the form above to add an extra recipient.'
              />
            </div>
          </div>
        </form>
      </SectionWrapper>
    );
  }
}

EditReport.defaultProps = {
  frequencyOptions: defaultFrequency
};

EditReport.propTypes = {
  texts: PropTypes.objectOf(PropTypes.string).isRequired,
  backUrl: PropTypes.string.isRequired,
  frequencyOptions: optionShape('number'),
  timeFormat: PropTypes.string.isRequired,
  ...injectedProps
};

export default statefullForm({
  propTypes: {
    data: PropTypes.shape(defaultInterface).isRequired
  }
})(EditReport);
