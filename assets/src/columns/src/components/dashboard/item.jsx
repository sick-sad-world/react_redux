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
      loading: false,
      edit: false
    };
    bindAll(this, 'toggleState', 'editColumn', 'hideColumn', 'getResults', 'deleteColumn');
  }

  toggleState(type) {
    return () => this.setState({ [type]: !this.state[type] });
  }


  editColumn(value, changed) {
    const data = { ...this.props.payload.data, ...value };
    this.setState({ loading: 'editing' });
    return this.props.editColumn({ id: this.props.payload.id, data, display_settings: this.props.payload.display_settings })
      .then(resp => (changed === 'infinite' || changed === 'autoreload') ? resp : this.getResults(data))
      .catch(console.error)
      .then(this.toggleState('loading'));
  }

  hideColumn() {
    return this.props.updateVisibility({ id: this.props.payload.id, open: 0 }, { silent: true });
  }

  deleteColumn() {
    this.setState({ loading: 'deleting' });
    return this.props.deleteColumn({ id: this.props.payload.id }).catch(console.error).then(this.toggleState('deleting'));
  }

  getResults(data = this.props.payload.data) {
    return this.props.getResults(data, { entity: this.props.payload.id });
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
              loading={this.state.loading === 'editing'}
              editColumn={this.editColumn}
              hideColumn={this.hideColumn}
              deleteColumn={this.toggleState('deleting')}
            />
          ) : null }
          <div className='content'>
            { children }
          </div>
          {(this.state.deleting) ? (
          <DeleteConfirmation loading={this.state.loading === 'deleting'} close={this.toggleState('deleting')} accept={this.deleteColumn}>
            <dl>
              <dt>Are you sure you want to delete the column</dt>
              <dd>{this.props.payload.name}</dd>
              <dd>Note: Alerts and Reports wich assigne to <b>THIS</b> column <b>only</b> also will be removed.</dd>
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
  deleteColumn: PropTypes.func.isRequired,
  updateVisibility: PropTypes.func.isRequired
};
