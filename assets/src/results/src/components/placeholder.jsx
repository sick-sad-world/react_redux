import { includes, filter } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { tableStats } from '../defaults';

// Result placholder component
// ===========================================================================
export default function Placeholder({ displaySettings }) {
  const inc = t => includes(displaySettings, t);
  const tableRows = filter(tableStats, inc);
  return (
    <article className='mod-result is-placeholder'>
      <aside>
        <span className='comparator'>
          <b>Found</b>
          Found
        </span>
        <a> </a>
        <a> </a>
        <a> </a>
      </aside>
      <div className='content'>
        <header>
          { (inc('title')) ? <h1>Trending stuff</h1> : null }
          { (inc('url')) ? <small>_</small> : null }
          { (inc('found')) ? <small>_</small> : null }
          { (inc('author')) ? <small>_</small> : null }
        </header>
        { (inc('image')) ? <figure className={classNames({ 'is-wide': inc('wide_image') })}> </figure> : null }
        { (inc('description')) ? (
          <div className='descr'>
            <p>_</p>
            <p>_</p>
            <p>_</p>
            <p>_</p>
          </div>
        ) : null }
        <footer>
          { (tableRows.length) ? (
            <table cellSpacing="5">
              <tbody>
                <tr>
                  <th>_</th>
                  <th>_</th>
                  <th>_</th>
                  <th>_</th>
                  <th>_</th>
                </tr>
                {tableRows.map((p, i) => (
                  <tr key={i}>
                    <td>_</td>
                    <td>_</td>
                    <td>_</td>
                    <td>_</td>
                    <td>_</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null }
        </footer>
      </div>
    </article>
  );
}

Placeholder.propTypes = {
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired
};
