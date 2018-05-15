import includes from 'lodash/includes';
import React from 'react';
import PropTypes from 'prop-types';

// Result placeholder component
// ===========================================================================
export default function Placeholder({ displaySettings, tableStats, heights }) {
  const tableRows = tableStats.filter(stat => includes(displaySettings, stat));
  return (
    <article className='mod-result is-placeholder'>
      <div className="content">
        <h1 style={{ maxHeight: heights.title }}>
          <span className='line'></span>
          <span className='line short'></span>
        </h1>
        {(includes(displaySettings, 'found') || includes(displaySettings, 'domain') || includes(displaySettings, 'author')) ? (
          <small style={{ height: heights.found || heights.domain || heights.author }}>
            <span className='line very-short'></span>
            <span className='line very-short'></span>
            <span className='line very-short'></span>
          </small>
        ) : null}
        {(includes(displaySettings, 'wide_image')) ? (
          <figure className='image' style={{ height: heights.wide_image }}>
          </figure>
        ) : (
          <div className='text' style={{ maxHeight: heights.description || heights.image }}>
            {(includes(displaySettings, 'image')) ? (
              <figure className='image'></figure>
            ) : null }
            {(includes(displaySettings, 'description')) ? (
              <div className='content'>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line short'></span>
              </div>
            ) : null }
          </div>
        )}
        {(tableRows && tableRows.length) ? (
          <table className='placeholder-table'>
            <tbody>
              <tr>
                <th style={{ height: heights.table }}></th>
                <th style={{ height: heights.table }}></th>
                <th style={{ height: heights.table }}></th>
                <th style={{ height: heights.table }}></th>
                <th style={{ height: heights.table }}></th>
              </tr>
              {tableRows.map((s, i) => (
                <tr key={i}>
                  <td style={{ height: heights.table }}></td>
                  <td style={{ height: heights.table }}></td>
                  <td style={{ height: heights.table }}></td>
                  <td style={{ height: heights.table }}></td>
                  <td style={{ height: heights.table }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </article>
  );
}

Placeholder.defaultProps = {
  heights: {}
};

Placeholder.propTypes = {
  heights: PropTypes.objectOf(PropTypes.string),
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableStats: PropTypes.arrayOf(PropTypes.string).isRequired
};
