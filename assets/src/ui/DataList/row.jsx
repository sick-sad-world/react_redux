import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash/bindAll';
import mapValues from 'lodash/mapValues';
import isFunction from 'lodash/isFunction';
import { childrenShape } from 'shared/typings';
import IconButton from '../IconButton';
import renderers from './renderers';
import Actionmenu, { actionConfigShape } from '../ActionMenu';

const toggleIcon = {
  true: ['chevron-up', 'Hide contents'],
  false: ['chevron-down', 'Show contents']
}

export function getRowStyles(size, margin) {
  return {
    flex: `0 0 ${(size.indexOf('%') > -1 && margin) ? `calc(${size} - ${margin}px)` : size}`,
    width: (size.indexOf('%') > -1 && margin) ? `calc(${size} - ${margin}px)` : size
  }
}

export const configColumnShape = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.string,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  def: PropTypes.string
}))

export const configActionShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.arrayOf(actionConfigShape)
]);

export default class DataListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subdata: false
    }
    bindAll(this, 'toggleSubdata')
  }

  toggleSubdata() {
    return this.setState(({subdata}) => ({subdata: !subdata}))
  }

  makeActions(item) {
    const {config, data} = this.props;
    if (isFunction(config.actions)) {
      return config.actions(item);
    }
    return mapValues(config.actions, ({handler, ...item}) => ({
      ...item,
      handler: () => handler(data)
    }));
  }

  render() {
    const { children, data, config, toggleActions, actionsOpen, sortable, rootClassName, template } = this.props;
    const { subdata } = this.state;
    const hasActions = config.actions && toggleActions;
    return (
      <li className={rootClassName}>
        <div className='item'>
          {sortable && <IconButton g='dots-three-vertical' />}
          <div className='content-holder'>
            <div className='content' style={{gridTemplateColumns: template}}>
              {config.columns.map((cfg) => {
                const { id, render } = cfg;
                const dataItem = data[id];
                let content = null;
    
                if (render instanceof Function) {
                  content = render(dataItem, cfg);
                } else if (typeof render === 'string' && renderers[render] instanceof Function) {
                  content = renderers[render](dataItem, cfg);
                } else {
                  content = renderers.renderDefault(dataItem, cfg);
                }
    
                return (
                  <div key={id}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
          {children && <IconButton g={toggleIcon[subdata][0]} onClick={this.toggleSubdata} title={toggleIcon[subdata][1]} />}
          {hasActions && <IconButton g='menu' onClick={toggleActions} title='Item Actions' />}
          {hasActions && actionsOpen && <Actionmenu data={this.makeActions()} />}
        </div>
        {(children && subdata) && children}
      </li>
    );
  }

}

DataListRow.defaultProps = {
  sortable: false,
  actionsOpen: false,
  rootClassName: 'DataListRow--root'
}

DataListRow.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Boolean indicating whatever list is sortable */
  sortable: PropTypes.bool.isRequired,
  /** Actual data to render in a row */
  data: PropTypes.object.isRequired, // eslint-disable-line
  /** Sublist is placed as a chidren and completely independent from parent */
  children: childrenShape,
  /** Handler responsible for opening/closing Actions popup, Usually this is provided by List */
  toggleActions: PropTypes.func,
  /** Indicates whatever actions popup should be rendered */
  actionsOpen: PropTypes.bool,
  /** Config that defines how each value should be rendered and actions related to item */
  config: PropTypes.shape({
    columns: configColumnShape.isRequired,
    actions: configActionShape
  }).isRequired
}