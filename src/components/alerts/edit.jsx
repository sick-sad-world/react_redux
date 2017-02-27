// Import utility stuff
// ===========================================================================
import { find, bindAll } from 'lodash';
import classNames from 'classnames';
import { inject } from '../../helpers/functions';
import editable from '../behaviours/editable';
import { defAlert } from '../../helpers/defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import actions
// ===========================================================================
import { createAction, throwError } from '../../actions/actions';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';
import EmailList from '../user/injectable';
import Toggler from '../toggler';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    inject(this, editable);
    this.stateMap = {
      name: true,
      active: true,
      frequency: true,
      columns: true,
      recipient: true
    };
    
    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['recipientHandler']);

    this.state = this.mapItemToState(this.props.item);
    
    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      create: createAction(this.props.type, 4),
      update: createAction(this.props.type, 5),
      throwError: throwError
    }, this.props.dispatch);

  }

  componentWillReceiveProps(newProps) {
    if (newProps.state <= 2) {
      this.setState(this.mapItemToState(newProps.item));
    }
  }

  // Select recipient from list providen by injectable
  // ===========================================================================
  recipientHandler (value) {
    return () => this._runStatefullAction('recipient', (value === this.state.recipient) ? this.props.email : value);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (typeof this.props.item.id !== 'number') return null;
    let { texts, item } = this.props;
    let running = this.props.state > 3

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <header className='subsection-header'>
          <Link to='/alerts'>
            <Icon icon='chevron-left' />
          </Link>
          <div className='text'>
            <h1>{`${texts.title} ${(item.name) ? ": '"+item.name+"'" : ''}`}</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funAlertName'>Alert name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.updateState}
                onBlur={this.preformAction('name')}
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
                value={this.state.active}
                onChange={this.updateValue}
              />
            </div>
            <div className='row-flex-wrap'>
              <label htmlFor='funAlertFrequency'>Frequency:</label>
              <Select
                disabled={running}
                className='size-120'
                name='frequency'
                options={this.props.frequencyOptions}
                onChange={this.makeSelectHandler('frequency')}
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
                onChange={this.makeSelectHandler('columns')}
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
              <EmailList className='row' active={this.state.recipient} disabled={running} onClick={this.recipientHandler} />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

Edit.defaultProps = {
  texts: {
    title: 'Edit alert',
    description: 'Pick the columns to watch. Set checking frequency, e-mail recipient and alert name here.',
  },
  frequencyOptions: [
    {value: 5, label: '5 min'},
    {value: 10, label: '10 min'},
    {value: 15, label: '15 min'},
    {value: 20, label: '20 min'},
    {value: 30, label: '30 min'},
    {value: 60, label: '60 min'}
  ]
}

// Transform app state to component props
// @ deps -> Alert, Columns
// ===========================================================================
let mapStateToProps = ({ app, alerts, columns, user }, ownProps) => {
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
    item = find(alerts, {id: parseInt(ownProps.params.id)}) || {};
  }

  // Return prepared data
  // ===========================================================================
  return {
    state: app.state,
    item: item,
    email: user.email,
    type: 'alert',
    columns: columns.map((item) => ({
      value: item.id,
      label: item.name,
      clearableValue: true
    }))
  }
};

export default connect(mapStateToProps)(Edit);