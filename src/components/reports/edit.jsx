// Import utility stuff
// ===========================================================================
import { find, pick, isNaN } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Select from 'react-select';
import Datetime from 'react-datetime';
import { connect } from 'react-redux';
import { defReport } from '../../reducers/defaults';

// Import Child components
// ===========================================================================
import EmailList from '../user/injectable';
import Toggler from '../toggler';
import EditFormHeader from '../editHeader';

// Import actions
// ===========================================================================
import createEditActions from '../../helpers/editActions';

class Edit extends React.Component {
  // Bind [changeHandler] to Component 
  // ===========================================================================
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      frequency: props.frequency || 15,
      columns: props.columns || []
    }
    this.changeHandler = this.props.changeHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.state = this.setState(pick(nextProps.item, ['frequency', 'columns']));
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item) return null;
    let item = this.props.item;
    let running = this.props.appState === 3

    // Frequency options array
    // ===========================================================================
    let frequencyOptions = [
      {value: 15, label: '15 min'},
      {value: 60, label: 'Hourly'},
      {value: 1440, label: 'Daily'},
      {value: 10080, label: 'Weekly'}
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
          <div className='row'>
            <label htmlFor='funReportName'>Report name:</label>
            <input 
              disabled={running}
              defaultValue={item.name}
              onBlur={this.changeHandler}
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
              onChange={this.changeHandler}
              value={item.active} />
          </div>
          <div className='row-flex-wrap'>
            <label htmlFor='funReportFrequency'>Frequency:</label>
            <Select
              disabled={running}
              className='size-180'
              name='frequency'
              options={frequencyOptions}
              onChange={this.props.createSelectHandler('frequency', this)}
              autosize={false}
              clearable={false}
              value={this.state.frequency}
            />
            <small className='form-description'>Check column(s) for new items every <i>x</i> minutes</small>
          </div>
          <div className='row-flex'>
            <label htmlFor='funReportNextSend'>Next send:</label>
            <Datetime 
              defaultValue={item.next_send}
              onBlur={(value) => this.changeHandler({target: {name: 'next_send', value: value.format('YYYY-MM-DD HH:mm:ss')}})}
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
              onChange={this.props.createSelectHandler('columns', this)}
              multi
              value={this.state.columns}
            />
          </div>
          <div className='row'>
            <h3 className='form-subtitle'>Email assigment:</h3>
            <EmailList email={this.props.email} email_bcc={this.props.email_bcc} className='row' disabled={running} />
          </div>
        </form>
      </section>
    );
  }
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
    item = find(reports, {id: parseInt(ownProps.params.id)});
  }

  // Return prepared data
  // ===========================================================================
  return {
    appState: app.appState,
    type: 'report',
    email: user.email,
    email_bcc: user.email_bcc,
    item: item,
    columns: columns.map((item) => {
      return {
        value: item.id,
        label: item.name,
        clearableValue: true
      }
    })
  }
};

export default connect(mapStateToProps, createEditActions())(Edit);