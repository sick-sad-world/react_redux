// Import utility stuff
// ===========================================================================
import { filter, bindAll, pick } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Select from 'react-select';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import EmailList from '../user/injectable';

class Edit extends React.Component {
  // Bind [changeHandler] to Component 
  // ===========================================================================
  constructor (props) {
    super(props);
    bindAll(this, ['changeHandler', 'changeFrequencyHandler', 'changeColumnsHandler']);
  }

  // Send request to server with new props 
  // ===========================================================================
  changeHandler (e) {
    console.log(e.target.name, e.target.value);
  }
  
  // Map [frequency] values to [changeHandler]
  // ===========================================================================
  changeFrequencyHandler (newVal) {
    this.changeHandler({target: {
      value: newVal.value,
      name: 'frequency'
    }});
  }

  // Map [columns] values to [changeHandler]
  // ===========================================================================
  changeColumnsHandler (newVal) {
    console.log(newVal);
    this.changeHandler({target: {
      value: newVal.map(item => item.id),
      name: 'columns'
    }});
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item) return null;
    let item = this.props.item;

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

    // Default texts
    // ===========================================================================
    let texts = Object.assign({
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props'
    }, this.props.texts);

    // Return DOM layout
    // ===========================================================================
    return (
      <section className='mod-subsection-edit'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title} '{ item.name }'</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className='subsection-content columned'>
          <div className='row'>
            <label htmlFor='funAlertName'>Alert name:</label>
            <input defaultValue={item.name} onChange={this.changeHandler} id='funAlertName' type='text' name='name' className='size-320' />
          </div>
          <div className='row-flex'>
            <span className='form-label'>Status:</span>
            <div className='toggler size-120'>
              <input defaultChecked={item.active === 0} onChange={this.changeHandler} type='radio' id='funAlertAvailablityNo' name='active' value='0' />
              <label htmlFor='funAlertAvailablityNo'>Inactive</label>
              <input defaultChecked={item.active === 1} onChange={this.changeHandler} type='radio' id='funAlertAvailablityYes' name='active' value='1' />
              <label htmlFor='funAlertAvailablityYes'>Active</label>
              <em></em>
              <span></span>
            </div>
          </div>
          <div className='row-flex-wrap'>
            <label htmlFor='funAlertFrequency'>Frequency:</label>
            <Select
              className='size-120'
              name='frequency'
              options={frequencyOptions}
              onChange={this.changeFrequencyHandler}
              autosize={false}
              clearable={false}
              value={item.frequency}
            />
            <small className='form-description'>Check column(s) for new items every <i>x</i> minutes</small>
          </div>
          <div className='row'>
            <label htmlFor='funAlertColumns'>Columns assigment:</label>
            <Select
              name='columns'
              options={this.props.columns}
              onChange={this.changeColumnsHandler}
              autosize={false}
              multi
              valueKey='id'
              labelKey='name'
            />
          </div>
          <EmailList className='row' />
        </form>
      </section>
    );
  }
}

// Transform app state to component props
// @ deps -> Alert, Columns
// ===========================================================================
let mapStateToProps = ({ alerts, columns }, ownProps) => ({
  item: filter(alerts, {id: parseInt(ownProps.params.id)})[0],
  columns: columns.map((item) => {
    return {
      id: item.id,
      name: item.name,
      clearableValue: true
    }
  })
});

export default connect(mapStateToProps)(Edit);