import bindAll from 'lodash/bindAll';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { classNameShape } from 'shared/typings';
import { ListStateRenderer, listStateRendererShape } from './renderers';

import DataListRow, { configColumnShape, configActionShape, getRowStyles } from './row';
import './styles.scss';

function updateIndexedState(prop, i) {
  return (state) => ({[prop]: (i === undefined || i === state[prop]) ? null: i})
}

export default class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      actions: null
    }
    bindAll(this, '_makeRootRef', 'clearActionMenu')
  }

  
  componentWillReceiveProps({data}) {
    this.setState(() => ({data}));
  }
  
  componentDidUpdate() {
    const method = (this.state.actions !== null) ? 'addEventListener' : 'removeEventListener';
    document.body[method]('click', this.clearActionMenu)
  }
  
  setActionState(i) {
    return () => this.setState(updateIndexedState('actions', i));
  }

  clearActionMenu({target}) {
    if (!this.root.contains(target)) {
      this.setState(updateIndexedState('actions'))
    }
  }

  _makeRootRef(el) {
    this.root = el;
  }

  render() {
    const { errorState, emptyState, className, rootClassName, config, sortable } = this.props;
    const { data, actions } = this.state;
    let content = null;

    if (errorState.text) {
      content = <ListStateRenderer type='error' className='state--error' {...errorState} />;
    } else if (!data.length) {
      content = <ListStateRenderer type='empty' className='state--empty' {...emptyState} />;
    } else {
      content = (
        <ul className='list-container'>
          {data.map((item, i) => (
            <DataListRow
              key={item.id}
              data={item}
              config={config}
              sortable={sortable}
              toggleActions={config.actions ? this.setActionState(i) : null}
              actionsOpen={config.actions && actions === i}
            >
              {(config.subdata && item.subdata) && (
                <ul className='sub-list-container'>
                  {item.subdata.map((subItem, i) => (
                    <DataListRow
                      key={subItem.id}
                      data={subItem}
                      config={config.subdata}
                      sortable={sortable}
                      toggleActions={config.subdata.actions ? this.setActionState(i) : null}
                      actionsOpen={config.subdata.actions && actions === i}
                    />
                  ))}
                </ul>
              )}
            </DataListRow>
          ))}
        </ul>
      );
    }

    return (
      <div className={classNames(rootClassName, className)} ref={this._makeRootRef}>
        <div key='list-header' className='DataList--header'>
          <div className='container'>
            {config.columns.map(({id, label, size}) => (<h5 key={id} style={getRowStyles(size)}>{label}</h5>))}
          </div>
        </div>
        {content}
      </div>
    );
  }
}

DataList.defaultProps = {
  sortable: false,
  sort: 'id',
  rootClassName: 'DataList--root',
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
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Whatever sortable wrappers should be applied */
  sortable: PropTypes.bool.isRequired,
  /** Config For column sizes renderers, and order */
  config: PropTypes.shape({
    columns: configColumnShape.isRequired,
    actions: configActionShape,
    subdata: PropTypes.shape({
      columns: configColumnShape.isRequired,
      actions: configActionShape
    })
  }).isRequired,
  /** ClassName applied to root component */
  className: classNameShape,
  /** Data parameter List should sorted by */
  sort: PropTypes.string,
  /** Configure Error state of DataList */
  errorState: PropTypes.shape(listStateRendererShape).isRequired,
  /** Configure Empty state of DataList */
  emptyState: PropTypes.shape(listStateRendererShape).isRequired,
  /** Data collection to display */
  data: PropTypes.arrayOf(PropTypes.object).isRequired // eslint-disable-line
}