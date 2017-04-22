// Import utility stuff
// ===========================================================================
import { includes, without, concat, bindAll, isEqual, forOwn } from 'lodash';
import { numOrString } from '../functions';
import { stateNum } from '../typecheck';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from './icon';

// Edit form high-order component - all basic interactions
// ===========================================================================
export default class EditForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.mapDataToState(this.props.data);
    bindAll(this, 'resetState', 'updateHandler', 'updateState');
  }

  componentWillReceiveProps(newProps) {
    if ((newProps.state === 2 && this.props.state !== newProps.state) || this.props.current !== newProps.current) {
      this.setState(this.mapDataToState(newProps.data));
    }
  }

  getValue(e) {
    let value;
    if (e) {
      if (e.target) {
        value = e.target.value;
      } else if (e instanceof Array && e[0] && e[0].value) {
        value = e.map(v => v.value);
      } else if (e.value) {
        value = e.value;
      } else {
        value = e;
      }
    } else {
      value = '';
    }
    return (typeof value === 'string') ? numOrString(value) : value;
  }

  updateState(name, getter) {
    return (...args) => this.stateUpdater({
      [name]: (this[getter] instanceof Function) ? this[getter].call(this, ...args) : this.getValue.call(this, ...args)
    });
  }

  compareValue(k, v) {
    return isEqual(v, this.props.data[k]);
  }

  stateUpdater(newState = {}) {
    let changed = [...this.state.changed];
    forOwn(newState, (v, k) => {
      if (this.compareValue(k, v)) {
        if (includes(this.state.changed, k)) changed = without(changed, k);
      } else if (!includes(this.state.changed, k)) changed = concat(changed, k);
    });
    newState.changed = changed;
    return this.setState(newState);
  }

  updateHandler(e) {
    e.preventDefault();
    const { changed, ...state } = this.state;
    return this.props.update(state, changed);
  }

  resetState() {
    return this.setState(this.mapDataToState(this.props.data));
  }

  renderFormHeader() {
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

  renderConfirmation() {
    if (!this.state.changed.length) return null;

    let text = this.props.texts.confirmation;
    if (text.indexOf('{data}') > -1) {
      text = text.replace('{data}', this.state.changed.map((change => change.replace('_', ' '))).join(', '));
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

EditForm.propTypes = {
  backPath: PropTypes.string,
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    confirmation: PropTypes.string.isRequired
  }).isRequired,
  current: PropTypes.number,
  state: stateNum.isRequired,
  data: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired
};
