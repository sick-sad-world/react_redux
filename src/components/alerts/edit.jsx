// Import utility stuff
// ===========================================================================
import { find, bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';
import { defAlert } from '../../reducers/defaults';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import EmailList from '../user/injectable';
import Toggler from '../toggler';
import EditFormHeader from '../editHeader';
import PageEdit from '../pageEdit';

class Edit extends PageEdit {
  constructor (props) {
    super(props, {
      frequency: (item) => item ? item.frequency : 15,
      columns: (item) => item ? item.columns : []
    });

    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['preformAction', 'inputHandler', 'createSelectHandler']);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id) return null;
    let item = this.props.item;
    let running = this.props.appState === 3

    // Frequency options array
    // ===========================================================================
    let frequencyOptions = [
      {value: 5, label: '5 min'},
      {value: 10, label: '10 min'},
      {value: 15, label: '15 min'},
      {value: 20, label: '20 min'},
      {value: 30, label: '30 min'},
      {value: 60, label: '60 min'}
    ];

    // Data for form heading
    // ===========================================================================
    let headingData = {
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props',
      name: item.name,
      running: running
    };

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <EditFormHeader {...headingData} />
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funAlertName'>Alert name:</label>
              <input 
                disabled={running}
                defaultValue={item.name}
                onBlur={this.inputHandler}
                id='funAlertName'
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
                onChange={this.inputHandler}
                value={item.active} />
            </div>
            <div className='row-flex-wrap'>
              <label htmlFor='funAlertFrequency'>Frequency:</label>
              <Select
                disabled={running}
                className='size-120'
                name='frequency'
                options={frequencyOptions}
                onChange={this.createSelectHandler('frequency')}
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
                onChange={this.createSelectHandler('columns')}
                multi
                value={this.state.columns}
              />
            </div>
          </div>
          <div className='form-block'>
            <div className='row'>
              <h3 className='form-subtitle'>Email assigment:</h3>
              <EmailList email={this.props.email} email_bcc={this.props.email_bcc} className='row' disabled={running} />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

// Transform app state to component props
// @ deps -> Alert, Columns
// ===========================================================================
let mapStateToProps = ({ alerts, columns, app, user }, ownProps) => {
  let item;

  if (ownProps.params.id === 'new') {
    // Make data for a new Report out of defaults
    // If we need to create one
    // ===========================================================================
    item = Object.assign({}, defAlert, {
      name: ownProps.location.query.name,
      order: alerts.length,
      recipient: user.email
    });
  } else {
    // Or find existing one
    // ===========================================================================
    item = find(alerts, {id: parseInt(ownProps.params.id)});
  }

  // Return prepared data
  // ===========================================================================
  return {
    appState: app.appState,
    type: 'alert',
    email: user.email,
    email_bcc: user.email_bcc,
    item: item || {},
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