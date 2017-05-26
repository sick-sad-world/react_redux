import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HotnessBar from '../hotness';

// Result table
// ===========================================================================
export default function FullResultTable({ data, to }) {
  return (
    <table className='stats-table'>
      <tbody>
        <tr>
          <th>Measure</th>
          <th>Total</th>
          <th>Rate</th>
          <th>Maxrate</th>
          <th>Acc</th>
          <th>First</th>
          <th>Hotness</th>
        </tr>
        { data.map(({ title, normal, rate, maxrate, hotness, acc, first }) => (
          <tr key={title}>
            <td><Link to={to}><b>{title}</b></Link></td>
            <td>{ normal }</td>
            <td>{ rate }</td>
            <td>{ maxrate }</td>
            <td>{acc}</td>
            <td>{first}</td>
            <td className='hotness'>
              { hotness }
              <HotnessBar value={hotness} />
            </td>
          </tr>
        )) }
      </tbody>
    </table>
  );
}

FullResultTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    normal: PropTypes.number.isRequired,
    rate: PropTypes.number.isRequired,
    maxrate: PropTypes.number.isRequired,
    hotness: PropTypes.number.isRequired,
    acc: PropTypes.number.isRequired,
    first: PropTypes.number.isRequired
  })),
  to: PropTypes.string
};
