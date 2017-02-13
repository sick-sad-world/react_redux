// Import utility stuff
// ===========================================================================
import { includes, without, concat, bindAll, omit, capitalize, isEqual } from 'lodash';
import { numOrString } from '../../helpers/functions';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Icon from '../icon';
import { Link } from 'react-router';

// Edit form high-order component - all basic interactions
// ===========================================================================
export default class EditForm extends React.Component {

  constructor (props) {
    super(props);
    this.state = this.mapDataToState(this.props.data);
    bindAll(this, 'resetState', 'updateHandler', 'updateState');
  }

  componentWillReceiveProps (newProps) {
    if (newProps.state === 2) this.setState(this.mapDataToState(newProps.data));
  }

  getValue (e) {
    let value = undefined;
    if (e.target) {
      value = e.target.value;
    } else if (e instanceof Array && e[0].value) {
      value = e.map(v => v.value);
    } else if (e.value) {
      value = e.value;
    } else {
      value = e;
    }
    return (typeof value === 'string') ? numOrString(value) : value;
  }
  
  updateState (name, getter) {
    return (e) => {
      let newState = {
        [name]: (this[getter] instanceof Function) ? this[getter].call(this, e) : this.getValue(e)
      };
      if (isEqual(newState[name], this.props.data[name])) {
        if (includes(this.state.changed, name)) newState.changed = without(this.state.changed, name);
      } else {
        if (!includes(this.state.changed, name)) newState.changed = concat(this.state.changed, name);
      }
      this.setState(newState);
    }
  }

  updateHandler (e) {
    e.preventDefault();
    return this.props.update(omit(this.state, 'changed'));
  }

  resetState () {
    return this.setState(this.mapDataToState(this.props.data));
  }

  renderFormHeader () {
    return (
      <header className='subsection-header'>
        { (this.props.backPath) ? <Link to={this.props.backPath}><Icon icon='chevron-left' /></Link> : null }
        <div className='text'>
          <h1>{`${this.props.texts.title} "${this.state.name}"`}</h1>
          <p>{this.props.texts.description}</p>
        </div>
      </header>
    );
  }

  renderConfirmation () {
    if (!this.state.changed.length) return null;

    let text = this.props.texts.confirmation;
    if (text.indexOf('{data}') > -1) {
      text = text.replace('{data}', this.state.changed.map((change => capitalize(change))).join(', '));
    }

    return (
      <div className='edit-confirmation'>
        <p>{text}</p>
        <div>
          <a onClick={this.updateHandler} className='button is-accent'>Apply</a>
          <a onClick={this.resetState} className='button'>Cancel</a>
        </div>
      </div>
    );
  }
}