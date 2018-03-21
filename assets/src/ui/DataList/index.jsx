import sortBy from 'lodash/sortBy';
import bindAll from 'lodash/bindAll';
import mapValues from 'lodash/mapValues';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import IconButton from '../IconButton';
import { ProgressRadial } from '../Progress';
import Actionmenu, {actionConfigShape} from '../ActionMenu';
import DataListRow, { configShape } from './row';
import './styles.scss';

function updateActionState(i) {
  return ({actions}) => ({actions: (i === undefined || i === actions) ? null: i})
}

function setData({data, sort}) {
  return (prevState) => {
    if (sort === prevState.sort) {
      return { data };
    }
    return { data: sortBy(data, sort), sort };
  }
}

export default class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sort: props.sort,
      actions: null
    }
    bindAll(this, 'makeRootRef', 'clearActionMenu')
  }

  componentWillMount() {
    this.setState(setData(this.props));
  }

  
  componentWillReceiveProps(newProps) {
    this.setState(setData(newProps));
  }
  
  componentDidUpdate() {
    const method = (this.state.actions !== null) ? 'addEventListener' : 'removeEventListener';
    document.body[method]('click', this.clearActionMenu)
  }
  
  setActionState(i) {
    return () => this.setState(updateActionState(i));
  }

  clearActionMenu({target}) {
    if (!this.root.contains(target)) {
      this.setState(updateActionState())
    }
  }

  makeonClickHandler(item, i) {
    return (this.props.onClick) ? (e) => this.props.onClick(item, i, e) : null;
  }

  makeActions(item) {
    if (isFunction(this.props.actions)) {
      return this.props.actions(item);
    }
    return mapValues(this.props.actions, ({handler, ...item}) => ({
      ...item,
      handler: () => handler(item)
    }));
  }

  makeRootRef(el) {
    this.root = el;
  }

  render() {
    const { config, actions, loading, sortable, loadingText, emptyText, emptyRenderer, loadingRenderer } = this.props;
    const { data } = this.state;
    return (
      <div className='DataList--root' ref={this.makeRootRef}>
        {(loading) ? loadingRenderer(loadingText) : (
            (data.length) ? (
              <ul>{
                data.map((item, i) => (
                  <DataListRow
                    key={item.id}
                    data={item}
                    config={config}
                    sortable={sortable}
                    onClick={this.makeonClickHandler(item, i)}
                  >
                    {actions && <IconButton g='menu' onClick={this.setActionState(i)} title='Item Actions' />}
                    {(actions && this.state.actions === i) && <Actionmenu data={this.makeActions(item)} />}
                  </DataListRow>
                ))
              }
              </ul>
            ) : emptyRenderer(emptyText)
        )}
      </div>
    );
  }
}

DataList.defaultProps = {
  loading: false,
  sortable: false,
  sort: 'id',
  loadingText: 'Loading...',
  loadingRenderer(text) {
    return(
      <div className='state--loading'>
        <ProgressRadial />
        <span>{text}</span>
      </div>
    );
  },
  emptyText: 'No items found',
  emptyRenderer(text) {
    return(
      <div className='state--empty'>
        <Icon g='images' />
        <span>{text}</span>
      </div>
    );
  }
}

DataList.propTypes = {
  sortable: PropTypes.bool.isRequired,
  config: PropTypes.arrayOf(configShape).isRequired,
  sort: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  loadingText: PropTypes.string.isRequired,
  loadingRenderer: PropTypes.func.isRequired,
  emptyText: PropTypes.string.isRequired,
  emptyRenderer: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  actions: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(actionConfigShape)
  ]),
  data: PropTypes.arrayOf(PropTypes.object).isRequired // eslint-disable-line
}