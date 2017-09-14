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
import DeleteConfirmation from 'common/components/delete-confirmation';
import ItemHeader from './header';
import ItemSettings from './settings';

export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      running: false,
      edit: false
    };
    bindAll(this, 'toggleState', 'editColumn', 'hideColumn', 'getResults', 'deleteColumn');
  }

  toggleState(type) {
    return () => this.setState({ [type]: !this.state[type] });
  }

  editColumn(value, changed) {
    return this.setState({ running: true }, () => {
      const data = { ...this.props.payload.data, ...value };
      return this.props.editColumn({ id: this.props.payload.id, data }).then((resp) => {
        if (changed === 'infinite' || changed === 'autoreload') return resp;
        return this.getResults(data);
      }).then(this.toggleState('running'));
    });
  }

  hideColumn() {
    return this.props.editColumn({
      id: this.props.payload.id,
      open: 0
    });
  }

  deleteColumn() {
    return this.props.deleteColumn({ id: this.props.payload.id }).then(this.toggleState('deleting'));
  }

  getResults(data) {
    return this.props.getResults((data) || this.props.payload.data, { entity: this.props.payload.id });
  }

  render() {
    const { payload, children } = this.props;
    return (
        <section className={classNames({
          'mod-column': true,
          'is-expanded': this.state.edit
        })}>
          <ItemHeader name={payload.name} toggle={this.toggleState('edit')} refresh={this.getResults}/>
          {(this.state.edit) ? (
            <ItemSettings
              id={payload.id}
              data={pick(payload.data, 'infinite', 'autoreload', 'sort', 'direction', 'limit')}
              running={this.state.running}
              editColumn={this.editColumn}
              hideColumn={this.hideColumn}
              deleteColumn={this.toggleState('deleting')}
            />
          ) : null }
          <div className='content'>
            { children }
          </div>
          {(this.state.deleting) ? (
          <DeleteConfirmation close={this.toggleState('deleting')} accept={this.deleteColumn}>
            <dl>
              <dt>Are you sure you want to delete the column</dt>
              <dd>{this.props.payload.name}</dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
        </section>
    );
  }
}

DashboardItem.propTypes = {
  children: PropTypes.element,
  payload: PropTypes.shape(defaultInterface).isRequired,
  getResults: PropTypes.func,
  editColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired
};
