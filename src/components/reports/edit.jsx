// Import utility stuff
// ===========================================================================
import { find, pick } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Select from 'react-select';
import Datetime from 'react-datetime';
import { connect } from 'react-redux';

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
              onChange={this.props.createSelectHandler('frequency')}
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
              onBlur={this.props.createSelectHandler('next_send')}
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
              onChange={this.props.createSelectHandler('columns')}
              multi
              valueKey='id'
              labelKey='name'
              value={this.state.columns}
            />
          </div>
          <div className='row'>
            <h3 className='form-subtitle'>Email assigment:</h3>
            <EmailList className='row' disabled={running} />
          </div>
        </form>
      </section>
    );
  }
}

// Transform app state to component props
// @ deps -> Alert, Columns
// ===========================================================================
let mapStateToProps = ({ reports, columns, app }, ownProps) => ({
  appState: app.appState,
  type: 'report',
  item: find(reports, {id: parseInt(ownProps.params.id)}),
  columns: columns.map((item) => {
    return {
      id: item.id,
      name: item.name,
      clearableValue: true
    }
  })
});

export default connect(mapStateToProps, createEditActions())(Edit);