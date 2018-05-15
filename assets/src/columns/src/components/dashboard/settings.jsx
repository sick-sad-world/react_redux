import bindAll from 'lodash/bindAll';
// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';
import { defColumnData, defaultDashboardInterface } from '../../defaults';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from 'common/components/icon';
import Sorting from '../sorting';
import Toggler from 'common/components/forms/toggler';

// Column quick settings on Dashboard
// ===========================================================================
export default class ItemSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.data
    };
    bindAll(this, 'updateSorting');
  }

  updateHandler(type) {
    return value => this.setState({ [type]: value }, () => this.props.editColumn({ [type]: value }, type));
  }

  updateSorting(sorting) {
    return this.setState({
      ...sorting
    }, () => this.props.editColumn({ ...sorting }));
  }

  hideItem() {
    return this.props.editColumn({ open: 0 });
  }

  render() {
    const { loading, hideColumn, id, deleteColumn } = this.props;
    return (
      <form className='column-settings'>
        <Sorting
          className='row-flex'
          value={{ sort: this.state.sort, direction: this.state.direction }}
          disabled={loading}
          onChange={this.updateSorting}
        />
        <Toggler
          disabled={loading}
          label='Infinite scroll'
          className='row-flex'
          name={`infinite-${id}`}
          options={[
            { value: 1, label: 'Yes' },
            { value: 0, label: 'No' }
          ]}
          onChange={this.updateHandler('infinite')}
          value={this.state.infinite}
        />
        <Toggler
          disabled={loading}
          label='Autoreloading'
          className='row-flex'
          name={`autoreload-${id}`}
          options={[
            { value: this.state.autoreload || 30, label: 'On' },
            { value: 0, label: 'Off' }
          ]}
          onChange={this.updateHandler('autoreload')}
          value={this.state.autoreload}
        />
        <div className='column-subnav'>
          <a onClick={hideColumn} title='Hide this column'><Icon icon='eye'/>Hide</a>
          <Link to={`/columns/${id}`} title='Column setting screen'><Icon icon='cog'/>Settings</Link>
          {(deleteColumn) ? <a onClick={deleteColumn} title='Delete this column'><Icon icon='trash'/>Delete</a> : null}
        </div>
      </form>
    );
  }
}

ItemSettings.defaultProps = {
  loading: false,
  data: { ...defColumnData }
};

ItemSettings.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.shape(defaultDashboardInterface).isRequired,
  loading: PropTypes.bool.isRequired,
  editColumn: PropTypes.func.isRequired,
  hideColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func
};
