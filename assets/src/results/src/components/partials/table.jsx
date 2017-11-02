import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HotnessBar from './hotness';

// Result table
// ===========================================================================
export default function ResultTable({ data, to, style }) {
  return (
    <table className='stats-table'>
      <tbody>
        <tr>
          <th>Measure</th>
          <th>Total</th>
          <th>Rate</th>
          <th>Maxrate</th>
          <th>Hotness</th>
        </tr>
        { data.map(({ title, normal, rate, maxrate, hotness }) => (
          <tr key={title}>
            <td>
              {(window.google && window.google.charts) ? (
                <Link to={`${to}&init=${title.toLowerCase()}`}><b>{title}</b></Link>
              ) : (
                <b>{title}</b>
              )}
            </td>
            <td style={style}>{ normal }</td>
            <td style={style}>{ rate }</td>
            <td style={style}>{ maxrate }</td>
            <td style={style} className='hotness'>
              { (hotness * 100).toFixed(2) }%
              <HotnessBar value={hotness} />
            </td>
          </tr>
        )) }
      </tbody>
    </table>
  );
}

ResultTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    normal: PropTypes.number.isRequired,
    rate: PropTypes.number.isRequired,
    maxrate: PropTypes.number.isRequired,
    hotness: PropTypes.number.isRequired
  })),
  style: PropTypes.objectOf(PropTypes.string),
  to: PropTypes.string
};