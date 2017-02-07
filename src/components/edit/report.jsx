// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import EditForm from './editForm';
import Emails from '../../containers/emails';
import Select from 'react-select';
import Datetime from 'react-datetime';
import Icon from '../icon';
import Toggler from '../toggler';

// Edit Report
// ===========================================================================
export default class EditReport extends EditForm {

  mapDataToState (data) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      active: data.active,
      frequency: data.frequency,
      columns: data.columns,
      recipient: data.recipient,
      next_send: data.next_send
    };
  }

  getNextSend (value) {
    return (typeof value === 'string') ? value : value.format('YYYY-MM-DD HH:mm:ss');
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    return (
      <section className={componentRootClass}>
        <header className='subsection-header'>
          <Link to={this.props.backPath}>
            <Icon icon='chevron-left' />
          </Link>
          <div className='text'>
            <h1>{`${this.props.texts.title} ${(this.state.name) ? ": '"+this.state.name+"'" : ''}`}</h1>
            <p>{this.props.texts.description}</p>
          </div>
        </header>
        { this.renderConfirmation() }
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funReportName'>Report name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.updateState('name')}
                id='funReportName'
                type='text'
                name='name'
              />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Status:</span>
              <Toggler 
                disabled={running}
                className='size-120'
                name='active'
                options={{
                  'Active': 1,
                  'Inactive': 0
                }}
                value={this.state.active}
                onChange={this.updateState('active')}
              />
            </div>
            <div className='row-flex-wrap'>
              <label htmlFor='funReportFrequency'>Frequency:</label>
              <Select
                disabled={running}
                className='size-180'
                name='frequency'
                options={this.props.frequencyOptions}
                onChange={this.updateState('frequency')}
                autosize={false}
                clearable={false}
                value={this.state.frequency}
              />
              <small className='form-description'>Check column(s) for new items every <i>x</i> minutes</small>
            </div>
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
            <div className='row'>
              <label htmlFor='funReportColumns'>Columns assigment:</label>
              <Select
                disabled={running}
                name='columns'
                options={this.props.columns}
                onChange={this.updateState('columns')}
                multi
                value={this.state.columns}
              />
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

EditReport.defaultProps = {
  texts: {
    title: 'Edit report',
    description: 'Pick the columns to send. Set time to send, e-mail recipient and report name here.',
    confirmation: '{data} was changed. Save changes?'
  },
  frequencyOptions: [
    {value: 15, label: '15 min'},
    {value: 60, label: 'Hourly'},
    {value: 1440, label: 'Daily'},
    {value: 10080, label: 'Weekly'}
  ]
};