// Import helper stuff
// ===========================================================================
import { bindAll, pick } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../../defaults';

// Import child components
// ===========================================================================
import ItemHeader from './header';
import ItemSettings from './settings';

export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      edit: false
    };
    bindAll(this, 'toggleState', 'editColumn', 'hideColumn');
  }

  componentWillReceiveProps() {
    this.setState({ edit: false });
  }

  toggleState(type) {
    return () => this.setState({ [type]: !this.state[type] });
  }

  editColumn(changed) {
    return this.setState({ running: true }, () => this.props.editColumn({
      id: this.props.payload.id,
      data: {
        ...this.props.payload.data,
        ...changed
      }
    }).then(this.toggleState('running')));
  }

  hideColumn() {
    return this.props.editColumn({
      id: this.props.payload.id,
      open: 0
    });
  }

  render() {
    const { payload, children } = this.props;
    return (
        <section className={classNames({
          'mod-column': true,
          'is-expanded': this.state.edit
        })}>
          <ItemHeader name={payload.name} toggle={this.toggleState('edit')}/>
          {(this.state.edit) ? (
            <ItemSettings
              id={payload.id}
              data={pick(payload.data, 'infinite', 'autoreload', 'sort', 'direction')}
              running={this.state.running}
              editColumn={this.editColumn}
              hideColumn={this.hideColumn}
              deleteColumn={this.props.deleteColumn}
            />
          ) : null }
          <div className='content'>
            { children }
          </div>
        </section>
    );
  }
}

DashboardItem.propTypes = {
  children: PropTypes.element,
  payload: PropTypes.shape(defaultInterface).isRequired,
  editColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired
};
