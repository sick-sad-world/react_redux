// Import utility stuff
// ===========================================================================
import { find, bindAll, pick, assign } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Select from 'react-select';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import EmailList from '../user/injectable';
import Toggler from '../toggler';
import EditFormHeader from '../editHeader';

// Import actions
// ===========================================================================
import { updateData, throwError } from '../../actions/actions';

class Edit extends React.Component {
  // Bind [changeHandler] to Component 
  // ===========================================================================
  constructor (props) {
    super(props);
    this.state = {
      frequency: null,
      columns: []
    }
    bindAll(this, ['changeHandler', 'createSelectHandler']);
  }

  componentWillReceiveProps(nextProps) {
    this.state = this.setState(assign(this.state, pick(nextProps.item, ['frequency', 'columns'])));
  }

  // Send request to server with new props 
  // ===========================================================================
  changeHandler (e) {
    let value = e.target.value;
    let dispatch = this.props.dispatch;
    dispatch(updateData(this.props.type)({
      id: this.props.item.id,
      [e.target.name]: (typeof value === 'object' && value.hasOwnProperty(length)) ? value.map(v => v.id) : value
    })).catch((err) => dispatch(throwError(err)))
  }

  // Select handler creator
  // -> Function which handles both action and state change
  // ===========================================================================
  createSelectHandler (name) {
    return (value) => {
      // Set state to update selects
      // then run change handler to send chnages to server
      // ===========================================================================
      this.setState(Object.assign({}, this.state, {[name]: value}), () => this.changeHandler({
        target: {
          name: name,
          value: (value.hasOwnProperty(length)) ? value : value.value
        } 
      }));
    }
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
              onChange={this.createSelectHandler('frequency')}
              autosize={false}
              clearable={false}
              value={this.state.frequency}
            />
            <small className='form-description'>Check column(s) for new items every <i>x</i> minutes</small>
          </div>
          <div className='row-flex'>
            <label htmlFor='funReportNextSend'>Next send:</label>
            <input 
              disabled={running}
              defaultValue={item.next_send}
              onBlur={this.changeHandler}
              id='funReportNextSend'
              type='text'
              name='next_send'
              className='size-180'
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

export default connect(mapStateToProps)(Edit);