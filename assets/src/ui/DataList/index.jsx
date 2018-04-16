import sortBy from 'lodash/sortBy';
import bindAll from 'lodash/bindAll';
import mapValues from 'lodash/mapValues';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import { actionConfigShape } from '../ActionMenu';
import { ListStateRenderer, listStateRendererShape } from './renderers';

import DataListRow, { configShape } from './row';
import './styles.scss';

function updateActionState(i) {
  return ({actions}) => ({actions: (i === undefined || i === actions) ? null: i})
}

function setData({data, sort}) {
  return (prevState) => {
    if (sort === prevState.sort) {
      return { data }
    }
    return { data: sortBy(data, sort), sort }
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
  
  renderDataList() {
    const { config, actions, sortable, data } = this.props;
    return data.map((item, i) => (
      <DataListRow
        key={item.id}
        data={item}
        config={config}
        sortable={sortable}
        onClick={this.makeonClickHandler(item, i)}
        toggleActions={this.setActionState(i)}
        actions={(actions && this.state.actions === i) ? this.makeActions(item) : null}
      />
    ));
  }

  render() {
    const { errorState, emptyState } = this.props;
    const { data } = this.state;

    let content = null;

    if (errorState.text) {
      content = <ListStateRenderer type='error' className='state--error' {...errorState} />;
    } else if (!data.length) {
      content = <ListStateRenderer type='empty' className='state--empty' {...emptyState} />;
    } else {
      content = <ul>{this.renderDataList()}</ul>;
    }

    return (
      <div className='DataList--root' ref={this.makeRootRef}>
        {content}
      </div>
    );
  }
}

DataList.defaultProps = {
  sortable: false,
  sort: 'id',
  errorState: {
    title: 'We encountered error during data retrieval',
    text: null,
    additional: null
  },
  emptyState: {
    title: 'This list is empty',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, nisi.',
    additional: null
  }
}

DataList.propTypes = {
  sortable: PropTypes.bool.isRequired,
  config: PropTypes.arrayOf(configShape).isRequired,
  sort: PropTypes.string,
  errorState: PropTypes.shape(listStateRendererShape).isRequired,
  emptyState: PropTypes.shape(listStateRendererShape).isRequired,
  onClick: PropTypes.func,
  actions: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(actionConfigShape)
  ]),
  data: PropTypes.arrayOf(PropTypes.object).isRequired // eslint-disable-line
}