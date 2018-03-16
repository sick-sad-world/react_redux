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

  makeonClickHandler(item, i) {
    return (this.props.onClick) ? (e) => this.props.onClick(item, i, e) : null;
  }

  render() {
    const { config, actions, loading, loadingText, emptyText, emptyRenderer, loadingRenderer, actionsRenderer } = this.props;
    const { data } = this.state;
    return (
      <div className='DataList--root'>
        {(loading) ? loadingRenderer({loadingText}) : (
          <ul>
            {(data.length) ? (
              data.map((item, i) => (
                <DataListRow key={item.id} data={item} config={config} onClick={this.makeonClickHandler(item, i)}>
                  {actions && actionsRenderer(actions, item, i)}
                </DataListRow>
              ))
            ) : emptyRenderer(emptyText)}
          </ul>
        )}
      </div>
    );
  }
}

DataList.defaultProps = {
  loading: false,
  sort: 'id',
  loadingText: 'Loading data...',
  loadingRenderer(text) {
    return(
      <span>{text}</span>
    );
  },
  emptyText: 'No items found',
  emptyRenderer(text) {
    return(
      <li className='state--empty'>{text}</li>
    );
  },
  actionsRenderer(actions, item, i) {
    return (
      <IconButton g='menu' title='Item Actions' />
    );
  }
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
  loadingRenderer: PropTypes.func.isRequired,
  emptyText: PropTypes.string.isRequired,
  emptyRenderer: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  actions: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.oneOf(['---']),
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          icon: PropTypes.string,
          handler: PropTypes.func.isRequired
        })
      ])
    )
  ]),
  actionsRenderer: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}