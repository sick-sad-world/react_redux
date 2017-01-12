// Import utility stuff
// ===========================================================================
import { find, bindAll } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Select from 'react-select';
import Datetime from 'react-datetime';
import { connect } from 'react-redux';
import { defReport } from '../../helpers/defaults';

// Import Child components
// ===========================================================================
import EmailList from '../user/injectable';
import Toggler from '../toggler';
import EditFormHeader from '../editHeader';
import PageEdit from '../pageEdit';

class Edit extends PageEdit {
  constructor (props) {
    super(props, {
      name: true,
      active: true,
      frequency: true,
      columns: true,
      recipient: true,
      next_send: true
    });

    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['preformAction', 'stateHandler', 'changeHandler', 'createSelectHandler', 'recipientHandler']);
  }

  // Select recipient from list providen by injectable
  // ===========================================================================
  recipientHandler (value) {
    if (value === this.props.item.recipient) {
      value = this.props.email;
    }
    this.changeHandler('recipient', value);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id) return null;
    let item = this.props.item;
    let running = this.props.state > 3;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <EditFormHeader {...this.props.headingTexts} name={item.name} running={running} />
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funReportName'>Report name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.stateHandler}
                onBlur={this.preformAction('name')}
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
                onChange={this.changeHandler}
              />
            </div>
            <div className='row-flex-wrap'>
              <label htmlFor='funReportFrequency'>Frequency:</label>
              <Select
                disabled={running}
                className='size-180'
                name='frequency'
                options={this.props.frequencyOptions}
                onChange={this.createSelectHandler('frequency')}
                autosize={false}
                clearable={false}
                value={this.state.frequency}
              />
              <small className='form-description'>Check column(s) for new items every <i>x</i> minutes</small>
            </div>
            <div className='row-flex'>
              <label htmlFor='funReportNextSend'>Next send:</label>
              <Datetime 
                defaultValue={this.state.next_send}
                onBlur={(value) => this.changeHandler('next_send', (typeof value === 'string') ? value : value.format('YYYY-MM-DD HH:mm:ss'))}
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
                onChange={this.createSelectHandler('columns')}
                multi
                value={this.state.columns}
              />
            </div>
          </div>
          <div className='form-block'>
            <div className='row'>
              <h3 className='form-subtitle'>Email assigment:</h3>
              <EmailList className='row' active={item.recipient} disabled={running} onClick={this.recipientHandler} />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

Edit.defaultProps = {
  headingTexts: {
    title: 'Edit report',
    description: 'Pick the columns to send. Set time to send, e-mail recipient and report name here.',
  },
  frequencyOptions: [
    {value: 15, label: '15 min'},
    {value: 60, label: 'Hourly'},
    {value: 1440, label: 'Daily'},
    {value: 10080, label: 'Weekly'}
  ]
}

// Transform app state to component props
// @ deps -> Alert, Columns
// ===========================================================================
const mapStateToProps = ({ reports, columns, app, user }, ownProps) => {
  let item;

  if (ownProps.params.id === 'new') {
    // Make data for a new Report out of defaults
    // If we need to create one
    // ===========================================================================
    item = Object.assign({}, defReport, {
      name: ownProps.location.query.name,
      order: reports.length,
      next_send: moment().format('YYYY-MM-DD HH:mm:ss'),
      recipient: user.email
    });
  } else {
    // Or find existing one
    // ===========================================================================
    item = find(reports, {id: parseInt(ownProps.params.id)}) || {};
  }

  // Return prepared data
  // ===========================================================================
  return {
    state: app.state,
    type: 'report',
    item: item,
    emai: user.email,
    columns: columns.map((item) => {
      return {
        value: item.id,
        label: item.name,
        clearableValue: true
      }
    })
  }
};

export default connect(mapStateToProps)(Edit);