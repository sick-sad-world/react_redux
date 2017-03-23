// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { includes, without, concat, bindAll, isEqual, forOwn } from 'lodash';
import { numOrString } from '../../helpers/functions';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';
import Icon from '../icon';

// Edit From HOC
// ===========================================================================
export default function EditForm(Form, defaultProps) {
  class EditForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = Form.mapDataToState(this.props.data);
      bindAll(this, 'resetState', 'updateHandler', 'updateState');
    }

    componentWillReceiveProps (newProps) {
      if (newProps.state === 2 && this.props.state !== newProps.state) this.setState(Form.mapDataToState(newProps.data));
    }

    getValue (e) {
      let value = undefined;
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
    
    updateState (name, getter) {
      return (e) => this.stateUpdater({
        [name]: (this[getter] instanceof Function) ? this[getter].call(this, e) : this.getValue(e)
      });
    }

    stateUpdater (newState = {}) {
      let changed = [...this.state.changed]
      forOwn(newState, (v, k) => {
        if (isEqual(v, this.props.data[k])) {
          if (includes(this.state.changed, k)) changed = without(changed, k);
        } else {
          if (!includes(this.state.changed, k)) changed = concat(changed, k);
        }
      });
      newState.changed = changed;
      return this.setState(newState);
    }

    updateHandler (e) {
      e.preventDefault();
      let {changed, ...state} = this.state;
      return this.props.update(state, changed);
    }

    resetState () {
      return this.setState(this.mapDataToState(this.props.data));
    }

    render () {
      let running = this.props.state > 2;
      let title = (this.state.name) ? `${this.props.texts.title} "${this.state.name}"` : this.props.texts.title ;

      return (
        <section className={classNames({
          'mod-subsection-edit': true,
          'state-loading': running
        })}>
          <header className='subsection-header'>
            { (this.props.backPath) ? <Link to={this.props.backPath}><Icon icon='chevron-left' /></Link> : null }
            <div className='text'>
              <h1>{title}</h1>
              <p>{this.props.texts.description}</p>
            </div>
          </header>
          <form className='subsection-content columned'>
            <Form {...this.state} updateState={this.updateState} />
          </form>
        </section>
      );
    }
  }

  EditForm.defaultProps = defaultProps;

  return EditForm;
}