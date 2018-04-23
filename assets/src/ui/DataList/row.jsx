import React from 'react';
import PropTypes from 'prop-types';
import { childrenShape } from 'shared/typings';
import IconButton from '../IconButton';
import renderers from './renderers';
import Actionmenu, { actionConfigShape } from '../ActionMenu';

function getRowStyles(size) {
  return {
    flex: `0 0 ${size}`,
    width: size
  }
}

export const configShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.string,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  def: PropTypes.string
});

export default function DataListRow({ children, data, config, toggleActions, actions, sortable, onClick, rootClassName }) {

  return (
    <li className={rootClassName}>
      <div className='item'>
        {sortable && <IconButton g='dots-three-vertical' />}
        <div className='content' onClick={onClick}>
          {config.map(({id, size, render, def }) => {

            const dataItem = data[id];
            let content = null;

            if (render instanceof Function) {
              content = render(dataItem);
            } else if (typeof render === 'string' && renderers[render] instanceof Function) {
              content = renderers[render](dataItem, def);
            } else {
              content = renderers.renderDefault(dataItem, def);
            }

            return (
              <div key={id} style={(size) ? getRowStyles(size) : {}}>
                {content}
              </div>
            );
          })}
        </div>
        {toggleActions && <IconButton g='menu' onClick={toggleActions} title='Item Actions' />}
        {toggleActions && actions && <Actionmenu data={actions} />}
      </div>
      {children}
    </li>
  );
}

DataListRow.defaultProps = {
  sortable: false,
  rootClassName: 'DataListRow--root'
}

DataListRow.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  sortable: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired, // eslint-disable-line
  children: childrenShape,
  onClick: PropTypes.func,
  toggleActions: PropTypes.func,
  config: PropTypes.arrayOf(configShape).isRequired,
  actions: PropTypes.arrayOf(actionConfigShape),
}