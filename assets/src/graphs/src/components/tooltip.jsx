import React from 'react';
import PropTypes from 'prop-types';

export default function CustomToolTip({ label, payload, viewBox, config, variable }) {
  const found = payload.find(({ name }) => name === 'found');
  return (
    <div className='custom-tooltip'>
      <h3>{label}</h3>
      {(found && found.value) ? <h4><b>Found:</b> <span>{found.value}</span></h4> : null}
        {config.reduce((acc, item, i) => {
          acc.push(
            <ul key={i}>
              {variable.map((v) => {
                const key = (v === 'value') ? item : `${item}_${v}`;
                const line = payload.find(({ name }) => name === key);
                if (line && line.value !== undefined) {
                  return <li key={key} style={{ color: line.stroke }}><b>{line.dataKey}</b> <span>{line.value}</span></li>;
                }
                return null;
              })}
            </ul>
          );
          return acc;
        }, [])}
    </div>
  );
}

CustomToolTip.propTypes = {
  label: PropTypes.string,
  payload: PropTypes.arrayOf(PropTypes.object),
  viewBox: PropTypes.object,
  config: PropTypes.arrayOf(PropTypes.string).isRequired,
  variable: PropTypes.arrayOf(PropTypes.string).isRequired
};
