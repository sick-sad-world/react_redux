// Import utility stuff
// ===========================================================================
import { includes, without, concat, bindAll, isEqual, forOwn } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { stateNum } from '../typecheck';

// Import child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from './icon';

// Edit form generic header component
// ===========================================================================
export function EditFormHeader({ title, description, url }) {
  return (
    <header className='subsection-header'>
      {(url) ? (
        <Link to={url}>
          <Icon icon='chevron-left' />
        </Link>
      ) : null}
      <div className='text'>
        <h1>{title}</h1>
        {(description) ? <p>{description}</p> : null}
      </div>
    </header>
  );
}

EditFormHeader.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};


export function EditFormConfirmation({ text, changed, apply, cancel }) {
  let message = text;
  if (text.indexOf('{data}') > -1) {
    message = text.replace('{data}', changed.map((change => change.replace('_', ' '))).join(', '));
  }

  return (
    <div className='edit-confirmation'>
      <p>{message}</p>
      <div>
        <a onClick={apply} className='button is-accent'>Apply</a>
        <a onClick={cancel} className='button'>Cancel</a>
      </div>
    </div>
  );
}

EditFormConfirmation.propTypes = {
  changed: PropTypes.arrayOf(PropTypes.string).isRequired,
  text: PropTypes.string.isRequired,
  apply: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};

export function MakeEditForm(Form, mapDataToState, getters = {}) {
  class EditForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = mapDataToState(this.props.data);
      forOwn(getters, (f, k) => {
        if (!(this[k] instanceof Function) && k.indexOf('get') === 0) {
          this[k] = f.bind(this);
        }
      });
      bindAll(this, 'resetState', 'updateHandler', 'updateState');
    }

    componentWillReceiveProps(newProps) {
      if ((newProps.state === 2 && this.props.state !== newProps.state) || this.props.current !== newProps.current) {
        this.setState(mapDataToState(newProps.data));
      }
    }

    updateState(name, getter) {
      return (value, ...args) => {
        const newValue = (this[getter] instanceof Function) ? getters[getter](value, ...args) : value;
        this.stateUpdater({
          [name]: (newValue) || ''
        });
      };
    }

    stateUpdater(newState = {}) {
      let changed = [...this.state.changed];
      forOwn(newState, (v, k) => {
        if (isEqual(v, this.props.data[k])) {
          if (includes(this.state.changed, k)) changed = without(changed, k);
        } else if (!includes(this.state.changed, k)) changed = concat(changed, k);
      });
      newState.changed = changed;
      return this.setState(newState);
    }

    updateHandler() {
      const { changed, ...state } = this.state;
      return this.props.update(state, changed);
    }

    resetState() {
      return this.setState(this.mapDataToState(this.props.data));
    }

    render() {
      const running = this.props.state > 2;
      const { texts, backPath } = this.props;
      return (
        <section className={classNames('mod-subsection-edit', this.props.className, { 'state-loading': running })}>
          <EditFormHeader title={`${texts.title} "${this.state.name}"`} description={texts.description} url={backPath} />
          <EditFormConfirmation text={texts.confirmation} changed={this.state.changed} apply={this.updateHandler} cancel={this.resetState} />
          <Form
            running={running}
            formValues={this.state}
            updateState={this.updateState}
          />
        </section>
      );
    }
  }

  const dataShape = (Form.getDataShape) ? Form.getDataShape() : {};
  EditForm.propTypes = {
    backPath: PropTypes.string,
    className: PropTypes.string,
    texts: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      confirmation: PropTypes.string.isRequired
    }).isRequired,
    current: PropTypes.number,
    state: stateNum.isRequired,
    data: PropTypes.shape(dataShape).isRequired,
    update: PropTypes.func.isRequired
  };

  return EditForm;
}
