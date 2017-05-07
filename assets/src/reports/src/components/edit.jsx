// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import moment from 'moment';
import { defaultFrequency, defaultInterface, defaultTimeFormat } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';

// Import Child components
// ===========================================================================
import Datetime from 'react-datetime';
import EditForm from 'common/components/edit-form';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';
import { EmailBcc } from 'src/user';

// Edit Report
// ===========================================================================
export default class EditReport extends EditForm {

  mapDataToState(data) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      active: data.active,
      frequency: data.frequency,
      columns: data.columns,
      recipient: data.recipient,
      next_send: data.next_send || moment().add(1, 'hours').format(this.props.timeFormat)
    };
  }

  getNextSend(value) {
    return (typeof value === 'string') ? value : value.format(this.props.timeFormat);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    const running = this.props.state > 2;

    return (
      <section className={classNames({
        'mod-subsection-edit': true,
        'state-loading': running
      })}>
        { this.renderFormHeader() }
        { this.renderConfirmation() }
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Report name'
              disabled={running}
              value={this.state.name}
              onChange={this.updateState('name')}
            />
            <Toggler
              label='Status'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='active'
              options={[
                { label: 'Active', value: 1 },
                { label: 'Inactive', value: 0 }
              ]}
              value={this.state.active}
              onChange={this.updateState('active')}
            />
            <Dropdown
              label='Frequency'
              disabled={running}
              className='row-flex-wrap'
              selectClassName='size-120'
              name='frequency'
              options={this.props.frequencyOptions}
              onChange={this.updateState('frequency')}
              value={this.state.frequency}
              desc={<span>Check column(s) for new items every <i>x</i> minutes</span>}
            />
            <div className='row-flex'>
              <label htmlFor='funReportNextSend'>Next send:</label>
              <Datetime
                value={this.state.next_send}
                onChange={this.updateState('next_send', 'getNextSend')}
                dateFormat='YYYY-MM-DD'
                timeFormat=' HH:mm:ss'
                inputProps={{
                  className: 'size-180',
                  disabled: running,
                  name: 'next_send'
                }}
              />
            </div>
            <Dropdown
              label='Columns assigment'
              disabled={running}
              className='row'
              name='columns'
              options={this.props.columns}
              onChange={this.updateState('columns')}
              multi={true}
              value={this.state.columns}
              desc='Watched columns (click on columns in the list to watch them too)'
            />
          </div>
          <div className='form-block'>
            <div className='row'>
              <h3 className='form-subtitle'>Email assigment:</h3>
              <EmailBcc active={this.state.recipient} disabled={running} onClick={this.updateState('recipient')} />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

EditReport.defaultProps = {
  texts: {
    title: 'Edit report',
    description: 'Pick the columns to send. Set time to send, e-mail recipient and report name here.',
    confirmation: '{data} was changed. Save changes?'
  },
  timeFormat: defaultTimeFormat,
  frequencyOptions: defaultFrequency
};

EditReport.propTypes = {
  data: PropTypes.shape(defaultInterface).isRequired,
  columns: optionShape('number'),
  create: PropTypes.func.isRequired
};
