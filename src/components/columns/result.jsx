// Import utility stuff
// ===========================================================================
import { includes, bindAll, filter } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';

// Main app screen - Dashboard
// ===========================================================================
export default class Result extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      fulltext: false
    }

    bindAll(this, ['checkDisplay', 'toggleFullText'])
  }

  checkDisplay (stat) {
    let value = this.props[stat];
    return includes(this.props.displaySettings, stat) && ((typeof value === 'string' && value.length) || (typeof value === 'number' && value >= 0));
  }

  toggleFullText (e) {
    e.preventDefault();
    this.setState({fulltext: !this.state.fulltext});
  }

  render() {
    let props = this.props;
    let display = props.displaySettings;
    let isWideImage = includes(display, 'wide_image');
    let tableRows = filter(this.props.tableStats, this.checkDisplay);
    return (
      <li>
        <article className='mod-result'>
          <div className='content'>
            <header>
              { (this.checkDisplay('title')) ? <h1><a href={props.url} target='_blank'>{props.title}</a></h1> : null }
              { (this.checkDisplay('url')) ? <small className='t-ellipsis'>Found at: <a target='_blank' href={props.url}>{props.url}</a></small> : null }
              <small className='t-ellipsis'>
                { (this.checkDisplay('found')) ? <span>On: <b><time dateTime={props.found}>{props.found}</time></b></span> : null }
                { (this.checkDisplay('author')) ? <span>by: <b>{props.Author}</b></span> : null }
              </small>
            </header>
            { (this.checkDisplay('image')) ? (
              <figure className={(isWideImage) ? 'is-wide' : null}>
                <img src={props.image} />
                { (isWideImage) ? <figcaption>{props.title}</figcaption> : null }
              </figure>
            ) : null }
            { (this.checkDisplay('description')) ? (
              <div className='descr'>
                <div className='summary'>{ props.description }</div>
                { (props.additional.length) ? <a className="btn-toggle-text" onClick={null}> Show full text</a> : null }
                {(this.state.fulltext && props.additional.length) ? <div className='full'>{props.additional}</div> : null }
              </div>
            ) : null }
            <footer>
              { (tableRows.length) ? (
                <table>
                  <tbody>
                    <tr>
                      <th>Measure</th>
                      <th>Total</th>
                      <th>Rate</th>
                      <th>Maxrate</th>
                      <th>Hotness</th>
                    </tr>
                    { tableRows.map((stat) => {
                      return (
                        <tr key={stat}>
                          <td><b>{stat}</b></td>
                          <td>{ props[stat] }</td>
                          <td>{ props[`rate_${stat}`] }</td>
                          <td>{ props[`maxrate_${stat}`] }</td>
                          <td title="<%= title %>">
                            <div>{ props[`hotness_${stat}`] }
                              <span style={{paddingRight: (100 - parseFloat(props[`hotness_${stat}`]) * 100) + '%'}} className={`color-bar`}></span>
                            </div>
                          </td>
                        </tr>
                      );
                    }) || null }
                  </tbody>
                </table>
              ) : null }
            </footer>
          </div> 
        </article>

      </li>
    );
  }
}