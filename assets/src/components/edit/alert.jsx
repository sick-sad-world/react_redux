// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import EditForm from './edit-form';
import TextInput from '../forms/input-text';
import Emails from '../../containers/emails';
import Select from 'react-select';
import Toggler from '../forms/toggler';

// Edit Alert
// ===========================================================================
export default class EditAlert extends EditForm {

  mapDataToState (data) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      active: data.active,
      frequency: data.frequency,
      columns: data.columns,
      recipient: data.recipient
    };
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

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
              id='funAlertName'
              name='name'
              label='Alert name'
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
              options={{
                'Active': 1,
                'Inactive': 0
              }}
              value={this.state.active}
              onChange={this.updateState('active')}
            />
            <div className='row-flex-wrap'>
              <label htmlFor='funAlertFrequency'>Frequency:</label>
              <Select
                disabled={running}
                className='size-120'
                name='frequency'
                options={this.props.frequencyOptions}
                onChange={this.updateState('frequency')}
                autosize={false}
                clearable={false}
                value={this.state.frequency}
              />
              <small className='form-description'>Check column(s) for new items every <i>x</i> minutes</small>
            </div>
            <div className='row'>
              <label htmlFor='funAlertColumns'>Columns assigment:</label>
              <Select
                disabled={running}
                name='columns'
                options={this.props.columns}
                onChange={this.updateState('columns')}
                multi
                value={this.state.columns}
              />
              <small className="form-description">
                Watched columns (click on columns in the list to watch them too)
              </small>
            </div>
          </div>
          <div className='form-block'>
            <div className='row'>
              <h3 className='form-subtitle'>Email assigment:</h3>
              <Emails active={this.state.recipient} disabled={running} action={this.updateState('recipient')} />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

EditAlert.defaultProps = {
  texts: {
    title: 'Edit alert',
    description: 'Pick the columns to watch. Set checking frequency, e-mail recipient and alert name here.',
    confirmation: '{data} was changed. Save changes?'
  },
  frequencyOptions: [
    {value: 5, label: '5 min'},
    {value: 10, label: '10 min'},
    {value: 15, label: '15 min'},
    {value: 20, label: '20 min'},
    {value: 30, label: '30 min'},
    {value: 60, label: '60 min'}
  ]
};