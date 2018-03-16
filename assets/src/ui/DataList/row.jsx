import React from 'react';
import PropTypes from 'prop-types';
import IconButtom from '../IconButton';
import renderers from './renderers';

function getRowStyles(size) {
  return {
    flex: `0 0 ${size}`,
    width: size
  }
}

export default function DataListRow({ children, data, config }) {
  return (
    <li className='DataListRow--root'>
      <IconButtom g='dots-three-vertical' />
      <div className='content'>
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
      {children}
    </li>
  );
}

DataListRow.propTypes = {
  data: PropTypes.object.isRequired,
  children: PropTypes.element,
  config: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.string,
    render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    def: PropTypes.string
  })).isRequired
}