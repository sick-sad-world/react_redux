import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash/bindAll';
import mapValues from 'lodash/mapValues';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import { classNameShape } from 'shared/typings';
import IconButton from '../IconButton';
import renderers from './renderers';
import Actionmenu, { actionConfigShape } from '../ActionMenu';

const toggleIcon = {
  true: ['chevron-up', 'Hide contents'],
  false: ['chevron-down', 'Show contents']
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

/**
 * Data List - one of key components of application, Allows to display data
 * through configurable set of columns, and provide a lot of exceeding functionality
 * like: D&D sorting, Custom actions, Default Renderers, 
 */
export default class DataListRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subdata: false
    }
    bindAll(this, 'makeActions', 'renderColumn', 'toggleSubdata')
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

  renderColumn({ id, render, ...cfg }) {
    const dataItem = this.props.data[id];
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
  }

  render() {
    const { config, toggleActions, actionsOpen, dragHandleProps, rootClassName, hasChildList, className, template } = this.props;
    const { subdata } = this.state;
    const hasActions = config.actions && toggleActions;
    return (
      <div className={classNames(rootClassName, className, {'subdata--open': subdata})}>
        {dragHandleProps && <IconButton g='dots-three-vertical' {...dragHandleProps} />}
        <div className='content' style={{gridTemplateColumns: template}}>
          {config.columns.map(this.renderColumn)}
        </div>
        {hasChildList && <IconButton g={toggleIcon[subdata][0]} onClick={this.toggleSubdata} title={toggleIcon[subdata][1]} />}
        {hasActions && <IconButton g='menu' onClick={toggleActions} title='Item Actions' />}
        {hasActions && actionsOpen && <Actionmenu data={this.makeActions()} />}
      </div>
    );
  }

}

DataListRow.defaultProps = {
  hasChildList: false,
  actionsOpen: false,
  rootClassName: 'DataListRow--root'
}

DataListRow.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** ClassNames applied to root element */
  className: classNameShape,
  /** Shape of props provided by DnD Draggable component, null is sorting is off */
  dragHandleProps: PropTypes.shape({
    tabIndex: PropTypes.number.isRequired,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onTouchStart: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    draggable: PropTypes.bool.isRequired
  }),
  /** CSS Grid declaration that defines column layout of row */
  template: PropTypes.string.isRequired,
  /** Actual data to render in a row */
  data: PropTypes.object.isRequired, // eslint-disable-line
  /** Handler responsible for opening/closing Actions popup, Usually this is provided by List */
  toggleActions: PropTypes.func,
  /** indicates whatever subdata was rendered, this will affect on button styles */
  hasChildList: PropTypes.bool.isRequired,
  /** Indicates whatever actions popup should be rendered */
  actionsOpen: PropTypes.bool,
  /** Config that defines how each value should be rendered and actions related to item */
  config: PropTypes.shape({
    columns: configColumnShape.isRequired,
    actions: configActionShape
  }).isRequired
}