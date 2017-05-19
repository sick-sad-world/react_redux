// Import utility stuff
// ===========================================================================
import { includes, without, concat, bindAll, isEqual, forOwn } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { stateNum, textShape } from '../typecheck';

// Import child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from '../components/icon';

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

export default function MakeEditForm(Form) {
  class EditForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = this.composeState(this.props.data);
      bindAll(this, 'resetState', 'updateHandler', 'updateState', 'stateUpdater');
    }

    componentWillReceiveProps(newProps) {
      if ((newProps.state === 2 && this.props.state !== newProps.state) || this.props.current !== newProps.current) {
        this.setState(this.composeState(newProps.data));
      }
    }

    composeState(data) {
      return {
        changed: [],
        ...Form.mapDataToState(data, this.props.formProps)
      };
    }

    updateState(name, getter) {
      return value => this.stateUpdater({
        [name]: (Form[getter] instanceof Function) ? Form[getter](value, this.props.formProps, this.state) : (value !== undefined) ? value : ''
      });
    }

    compareValue(v, k) {
      if (Form.compareValue) {
        return Form.compareValue(v, k, this.props.data);
      }
      return isEqual(v, this.props.data[k]);
    }

    stateUpdater(newState = {}) {
      let changed = [...this.state.changed];
      forOwn(newState, (v, k) => {
        if (this.compareValue(v, k)) {
          if (includes(this.state.changed, k)) changed = without(changed, k);
        } else if (!includes(this.state.changed, k)) changed = concat(changed, k);
      });
      newState.changed = changed;
      return this.setState(newState);
    }

    updateHandler() {
      const { changed, ...state } = this.state;
      return this.props.update(Form.mapStateToData(state, this.props.data, changed, this.props.formProps), changed);
    }

    resetState() {
      return this.setState(this.composeState(this.props.data));
    }

    render() {
      const running = this.props.state > 2;
      const { texts, backPath } = this.props;
      const title = (this.state.name) ? `${texts.title} "${this.state.name}"` : texts.title;
      return (
        <section className={classNames('mod-subsection-edit', this.props.className, { 'state-loading': running })}>
          <EditFormHeader title={title} description={texts.description} url={backPath} />
          {(this.state.changed.length) ? (
            <EditFormConfirmation text={texts.confirmation} changed={this.state.changed} apply={this.updateHandler} cancel={this.resetState} />
          ) : null}
          <Form
            running={running}
            formValues={this.state}
            updateState={this.updateState}
            stateUpdater={this.stateUpdater}
            {...this.props.formProps}
          />
        </section>
      );
    }
  }

  EditForm.defaultProps = {
    state: 2,
    texts: {
      title: 'Edit form',
      description: 'Default form to modify things',
      confirmation: '{data} was changed. Save changes?'
    },
    formProps: {}
  };

  EditForm.propTypes = {
    backPath: PropTypes.string,
    className: PropTypes.string,
    texts: PropTypes.shape(textShape).isRequired,
    formProps: PropTypes.object.isRequired,
    current: PropTypes.number,
    state: stateNum.isRequired,
    data: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    ...((Form.getDataShape) ? Form.getDataShape() : {})
  };

  return EditForm;
}

export const injectedPropsType = {
  running: PropTypes.bool.isRequired,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired
};
