import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// Result table
// ===========================================================================
export default function ResultTable({ data, to, style, texts, colorRange }) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Measure</th>
          <th>Total</th>
          <th>Rate</th>
          <th>Maxrate</th>
          <th>Hotness</th>
        </tr>
        { data.map(({ title, normal, rate, maxrate, hotness }) => {
          let text;
          return (
            <tr key={title}>
              <td style={style}><Link to={to}><b>{title}</b></Link></td>
              <td style={style}>{ normal }</td>
              <td style={style}>{ rate }</td>
              <td style={style}>{ maxrate }</td>
              <td style={style} title={text} className='hotness'>
                { hotness }
                <span style={{ paddingRight: (hotness > 1) ? '0' : `${100 - (hotness * 100)}%` }} className={classNames('color-bar', { 'is-new': hotness > 1 })}></span>
              </td>
            </tr>
          );
        }) || null }
      </tbody>
    </table>
  );
}

ResultTable.defaultProps = {
  colorRange: [0.3, 0.5, 0.75, 0.99999],
  texts: {
    notHot: 'These story is not "hot" anymore',
    wasHot: 'A bit hot, but past it prime',
    hot: 'This is "hot" story',
    veryHot: 'This is very "hot" story',
    isNew: 'Be careful this is "new" story and result may be different'
  }
};

ResultTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    normal: PropTypes.number.isRequired,
    rate: PropTypes.number.isRequired,
    maxrate: PropTypes.number.isRequired,
    hotness: PropTypes.number.isRequired
  })),
  style: PropTypes.objectOf(PropTypes.string),
  to: PropTypes.string,
  texts: PropTypes.shape({
    notHot: PropTypes.string.isRequired,
    wasHot: PropTypes.string.isRequired,
    hot: PropTypes.string.isRequired,
    veryHot: PropTypes.string.isRequired,
    isNew: PropTypes.string.isRequired
  }).isRequired,
  colorRange: PropTypes.arrayOf(PropTypes.number).isRequired
};
