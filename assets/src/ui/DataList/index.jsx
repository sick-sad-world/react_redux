import sortBy from 'lodash/sortBy';
import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';
import DataListRow from './row';
import './styles.scss';

export default class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sort: props.sort
    }
  }

  componentWillMount() {
    this.setDataState(this.props.data);
  }

  componentWillReceiveProps({ data, sort }) {
    this.setDataState(data, sort);
  }

  setDataState(data, sort = this.state.sort) {
    this.setState(() => ({ data: sortBy(data, sort), sort }));
  }

  renderRowActions() {
    return <IconButton g='menu' title='Item Actions' />
  }

  render() {
    const { config, actions, loading, loadingText, emptyText } = this.props;
    const { data } = this.state;
    return (
      <div className='DataList--root'>
        {(!loading) ? (
          <ul>
            {(data.length) ? (
              data.map((item) => (
                <DataListRow key={item.id} data={item} config={config}>
                  {actions && this.renderRowActions()}
                </DataListRow>
              ))
            ) : (
              <li className='state--empty'>{emptyText}</li>
            )}
          </ul>
        ) : <span>{loadingText}</span>}
      </div>
    );
  }
}

DataList.defaultProps = {
  loading: false,
  sort: 'id',
  loadingText: 'Loading data...',
  emptyText: 'No items found'
}

DataList.propTypes = {
  config: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.string,
    render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    def: PropTypes.string
  })).isRequired,
  sort: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  loadingText: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({

  })),
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}